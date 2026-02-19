import * as XLSX from 'xlsx';
import type { BudgetItem } from '../../components/budget/ImportBudgetModal';

export const parseBudgetFile = async( file: File): Promise<any[][]> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    const firstSheet = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[firstSheet];

    const rows = XLSX.utils.sheet_to_json<any[]>(workSheet, {
        header: 1,
        defval: "",
    });

    return rows;
}

export const cleanBudgetFile = (rows: any[][]) => {
  return rows.filter((row) => {
    const rawDescription = String(row[0] ?? "").trim();
    const description = rawDescription.toLowerCase();

    // Clean numeric detection (handles commas like 1,200,000)
    const parseAmount = (value: any) => {
      if (value == null) return NaN;
      const cleaned = String(value).replace(/,/g, "").trim();
      return Number(cleaned);
    };

    const amount =
      parseAmount(row[5]) ||
      parseAmount(row[2]);

    const hasValidAmount =
      !isNaN(amount) && amount > 0;

    const joined = row.join(" ").toLowerCase();

    // Remove empty rows
    if (!description) return false;

    // 🔴 Remove structural total rows (strict patterns)
    const structuralTotalPatterns = [
      /^total$/,
      /^sub[-\s]?total$/,
      /^grand\s*total$/,
      /^total\s*direct\s*cost$/,
      /^indirect\s*cost/,
      /sub[-\s]?total\s*\(not/
    ];

    if (
      structuralTotalPatterns.some((pattern) =>
        pattern.test(description)
      )
    ) {
      return false;
    }

    // 🔴 Remove document/header rows ONLY if they don't have money
    if (
      (
        joined.includes("tetfund") ||
        joined.includes("institution") ||
        joined.includes("budget") ||
        joined.includes("component")
      ) &&
      !hasValidAmount
    ) {
      return false;
    }

    // 🔴 Remove column headers
    if (
      joined.includes("description") &&
      joined.includes("total")
    ) {
      return false;
    }

    return true;
  });
};


export const mapBudgetRows = (rows: any[][]): BudgetItem[] => {
  const results: BudgetItem[] = [];
  let currentCategory = "Uncategorized";

  const parseAmount = (value: any) => {
    if (value == null) return NaN;
    const cleaned = String(value).replace(/,/g, "").trim();
    return Number(cleaned);
  };

  for (const row of rows) {
    const rawDescription = String(row[0] ?? "")
      .replace(/\r?\n/g, " ")
      .trim();

    const amount =
      parseAmount(row[5]) ||
      parseAmount(row[2]);

    const hasValidAmount =
      !isNaN(amount) && amount > 0;

    // 🔵 CATEGORY DETECTION
    // If no valid amount, treat as category row
    if (!hasValidAmount && rawDescription.length > 2) {
      currentCategory = rawDescription;
      continue; // move to next row
    }

    // 🟢 REAL BUDGET ITEM
    if (hasValidAmount && rawDescription.length > 3) {
      results.push({
        description: rawDescription,
        total: amount,
        category: currentCategory,
      });
    }
  }

  return results;
};

