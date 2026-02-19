export const BUDGET_CATEGORY_MAP: Record<string, string> = {
    Personnel: "Personnel Costs/Allowances",
    Equipment: "Equipment (List & Specify)",
    Supplies: "Supplies/ Consumables",
    Data: "Data Collection & Analysis",
    Travels: "Travels",
    Dissemination: "Dissemination",
    Miscellaneous: "Miscellaneous",
};

export const BUDGET_CATEGORIES = Object.entries(BUDGET_CATEGORY_MAP).map(
    ([dbValue, uiValue]) => ({
        dbValue,
        uiValue,
    })
);

export const matchCategory = (rawText: string): string => {
    const text = rawText.toLowerCase();

    if (text.includes('personnel') || text.includes('staff') || text.includes('salary') || text.includes('allowance') || text.includes('stipend')) {
        return 'Personnel';
    }
    if (text.includes('equipment') || text.includes('hardware') || text.includes('laptop') || text.includes('machine') || text.includes('tool')) {
        return 'Equipment';
    }
    if (text.includes('supplies') || text.includes('consumable') || text.includes('material') || text.includes('stationery')) {
        return 'Supplies';
    }
    if (text.includes('data') || text.includes('collection') || text.includes('survey') || text.includes('analysis') || text.includes('software') || text.includes('cloud')) {
        return 'Data';
    }
    if (text.includes('travel') || text.includes('logistics') || text.includes('transport') || text.includes('flight') || text.includes('hotel')) {
        return 'Travels';
    }
    if (text.includes('dissemination') || text.includes('publication') || text.includes('conference') || text.includes('journal') || text.includes('workshop')) {
        return 'Dissemination';
    }

    return 'Miscellaneous';
};
