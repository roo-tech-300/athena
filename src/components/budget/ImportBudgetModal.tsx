import React, { useState } from 'react'
import { FileSpreadsheet, Upload, X, Trash2, Edit2, Save, ArrowLeft, CheckCircle2, Download } from 'lucide-react'
import Button from '../ui/Button'
import Loader from '../ui/Loader'
import { useToast } from '../ui/Toast'
import { cleanBudgetFile, mapBudgetRows, parseBudgetFile } from '../../utils/Budget/uploadBudget'
import { useCreateBudgetItem } from '../../hooks/useBudget'
import NairaSymbol from '../ui/NairaSymbol'
import { BUDGET_CATEGORY_MAP, matchCategory } from '../../constants/budget'

interface ImportBudgetModalProps {
    isOpen: boolean
    onClose: () => void
    grantId: string
}

export interface BudgetItem {
    description: string;
    total: number;
    category: string;
    id?: string;
}

export default function ImportBudgetModal({ isOpen, onClose, grantId }: ImportBudgetModalProps) {
    const { addToast } = useToast()
    const { mutateAsync: createItem } = useCreateBudgetItem()

    const [importFile, setImportFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [processedCount, setProcessedCount] = useState(0)
    const [step, setStep] = useState<'upload' | 'review'>('upload')
    const [items, setItems] = useState<BudgetItem[]>([])
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editData, setEditData] = useState<BudgetItem | null>(null)

    const handleFileSelect = (file: File) => {
        if (file && (file.name.endsWith('.xlsx') || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
            setImportFile(file);
        } else {
            addToast("Only .xlsx files are accepted", "warning");
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleFileParse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!importFile) return;

        setIsProcessing(true);
        try {
            const rows = await parseBudgetFile(importFile);
            const cleanedRows = cleanBudgetFile(rows);
            const mapped = mapBudgetRows(cleanedRows);

            if (mapped.length === 0) {
                addToast("No valid budget items found in the file", "warning");
            } else {
                setItems(mapped.map((item, idx) => ({ ...item, id: `${idx}-${Date.now()}` })));
                setStep('review');
                addToast(`Found ${mapped.length} items to review`, "success");
            }
        } catch (error) {
            console.error(error);
            addToast("Failed to parse budget file. Check format.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const startEdit = (index: number) => {
        setEditingId(index);
        setEditData({ ...items[index] });
    };

    const saveEdit = () => {
        if (editingId !== null && editData) {
            const newItems = [...items];
            newItems[editingId] = editData;
            setItems(newItems);
            setEditingId(null);
            setEditData(null);
        }
    };

    const handleFinalImport = async () => {
        if (items.length === 0) return;
        setIsUploading(true);
        setProcessedCount(0);
        let successCount = 0;

        try {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const dbCategory = matchCategory(item.category);

                await createItem({
                    grantId,
                    description: item.description,
                    category: dbCategory,
                    status: 'Planned',
                    price: item.total
                });
                successCount++;
                setProcessedCount(i + 1);

                // Small delay to allow UI updates
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            addToast(`Successfully imported ${successCount} budget items`, "success");
            onClose();
            resetStates();
        } catch (error) {
            console.error(error);
            addToast(`Import partially failed. ${successCount} items added.`, "error");
        } finally {
            setIsUploading(false);
            setProcessedCount(0);
        }
    };

    const resetStates = () => {
        setStep('upload');
        setItems([]);
        setImportFile(null);
        setEditingId(null);
        setEditData(null);
    };

    const totalBudget = items.reduce((acc, item) => acc + item.total, 0);

    if (!isOpen) return null;

    const progressPercentage = items.length > 0 ? (processedCount / items.length) * 100 : 0;

    return (
        <>
            {/* Progress Overlay - Fixed to viewport */}
            {isUploading && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '24px',
                    backdropFilter: 'blur(8px)'
                }}>
                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                        <div className="pulse-loader" style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            border: '4px solid var(--color-accent-indigo)',
                            opacity: 0.3
                        }} />
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-accent-indigo)'
                        }}>
                            <Upload size={32} className="animate-bounce" />
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0', color: 'white' }}>Syncing Budget Items</h3>
                        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                            Adding item {processedCount} of {items.length}...
                        </p>
                    </div>

                    <div style={{ width: '300px', height: '8px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${progressPercentage}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--color-accent-indigo), #818cf8)',
                            transition: 'width 0.3s ease',
                            boxShadow: '0 0 10px rgba(79, 70, 229, 0.6)'
                        }} />
                    </div>

                    <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Please do not close this window
                    </p>
                </div>
            )}

            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}
                onClick={onClose}
            >
                <div
                    className="card-neumorphic"
                    style={{
                        background: 'white',
                        padding: '32px',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: step === 'upload' ? '550px' : '1000px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        position: 'relative'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {step === 'review' && (
                                <button onClick={() => setStep('upload')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', marginRight: '8px' }}>
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-indigo)' }}>
                                <FileSpreadsheet size={20} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                                    {step === 'upload' ? 'Import Budget' : 'Review Budget Items'}
                                </h2>
                                <p style={{ fontSize: '12px', color: 'var(--color-gray-400)', margin: 0 }}>
                                    {step === 'upload' ? 'Upload your budget spreadsheet (.xlsx)' : `Adjust and confirm ${items.length} detected items`}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)' }}><X size={20} /></button>
                    </div>

                    {step === 'upload' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            {/* Template Guidance Section */}
                            <div style={{
                                background: 'rgba(79, 70, 229, 0.03)',
                                border: '1px solid rgba(79, 70, 229, 0.1)',
                                borderRadius: '12px',
                                padding: '24px',
                                display: 'flex',
                                gap: '20px',
                                alignItems: 'flex-start'
                            }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '10px',
                                    background: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    color: 'var(--color-accent-indigo)',
                                    flexShrink: 0
                                }}>
                                    <FileSpreadsheet size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--color-gray-900)' }}>Syncing with our Backend</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--color-gray-600)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                                        To ensure your budget items are processed correctly by our system, please follow our standardized template. Using other formats may cause detection errors or sync failures.
                                    </p>
                                    <a
                                        href="/athena_template.xlsx"
                                        download="Athena_Tetfund_Budget_Template.xlsx"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '13px',
                                            fontWeight: 600,    
                                            color: 'var(--color-accent-indigo)',
                                            textDecoration: 'none',
                                            background: 'white',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            border: '1px solid rgba(79, 70, 229, 0.2)',
                                            transition: 'all 0.2s ease'
                                        }}
                                        className="btn-hover-effect"
                                    >
                                        <Download size={18} />
                                        Download Budget Template (.xlsx)
                                    </a>
                                </div>
                            </div>

                            <form onSubmit={handleFileParse} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div
                                    style={{
                                        border: '2px dashed',
                                        borderRadius: '16px',
                                        padding: '40px 20px',
                                        textAlign: 'center',
                                        cursor: importFile ? 'default' : 'pointer',
                                        background: isDragging ? 'rgba(79, 70, 229, 0.1)' : importFile ? 'rgba(79, 70, 229, 0.05)' : 'var(--color-gray-25)',
                                        borderColor: isDragging || importFile ? 'var(--color-accent-indigo)' : 'var(--color-gray-200)',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '12px',
                                        position: 'relative'
                                    }}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => !importFile && document.getElementById('xlsx-import-file')?.click()}
                                >
                                    <input
                                        id="xlsx-import-file"
                                        type="file"
                                        accept=".xlsx"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileSelect(file);
                                            e.target.value = '';
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                    {importFile ? (
                                        <>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                <FileSpreadsheet size={24} />
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-gray-900)' }}>{importFile.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-gray-400)', marginBottom: '12px' }}>{(importFile.size / 1024).toFixed(1)} KB</div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setImportFile(null);
                                                    }}
                                                    style={{
                                                        fontSize: '12px',
                                                        color: '#ef4444',
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        border: 'none',
                                                        padding: '4px 12px',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontWeight: 600,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        margin: '0 auto'
                                                    }}
                                                >
                                                    <Trash2 size={14} /> Remove File
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: isDragging ? 'var(--color-accent-indigo)' : 'var(--color-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDragging ? 'white' : 'var(--color-gray-400)', transition: 'all 0.2s' }}>
                                                <Upload size={24} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-gray-900)' }}>
                                                    {isDragging ? 'Drop it here!' : 'Click to upload or drag and drop'}
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-gray-400)' }}>Excel Spreadsheet (.xlsx) • max 10MB</div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                                    <Button variant="primary" type="submit" disabled={!importFile || isProcessing} style={{ minWidth: '120px' }}>
                                        {isProcessing ? <Loader /> : 'Extract Items'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ overflowX: 'auto', border: '1px solid var(--color-gray-100)', borderRadius: '12px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ background: 'var(--color-gray-25)', borderBottom: '1px solid var(--color-gray-100)' }}>
                                        <tr>
                                            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--color-gray-500)' }}>#</th>
                                            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--color-gray-500)' }}>Description</th>
                                            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--color-gray-500)', width: '200px' }}>Category (Detected)</th>
                                            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--color-gray-500)', width: '150px' }}>Total Amount</th>
                                            <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--color-gray-500)', textAlign: 'right', width: '100px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid var(--color-gray-50)', background: editingId === idx ? 'var(--color-gray-25)' : 'transparent' }}>
                                                <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--color-gray-400)' }}>{idx + 1}</td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    {editingId === idx ? (
                                                        <input
                                                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-gray-200)' }}
                                                            value={editData?.description}
                                                            onChange={(e) => setEditData({ ...editData!, description: e.target.value })}
                                                        />
                                                    ) : (
                                                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{item.description}</div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    {editingId === idx ? (
                                                        <input
                                                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-gray-200)', fontSize: '12px' }}
                                                            value={editData?.category}
                                                            onChange={(e) => setEditData({ ...editData!, category: e.target.value })}
                                                            placeholder="Raw category text"
                                                        />
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-accent-indigo)' }}>
                                                                {BUDGET_CATEGORY_MAP[matchCategory(item.category)]}
                                                            </span>
                                                            <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', fontStyle: 'italic' }}>
                                                                via "{item.category}"
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    {editingId === idx ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <NairaSymbol />
                                                            <input
                                                                type="number"
                                                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-gray-200)' }}
                                                                value={editData?.total}
                                                                onChange={(e) => setEditData({ ...editData!, total: Number(e.target.value) })}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div style={{ fontSize: '14px', fontWeight: 700 }}>
                                                            <NairaSymbol />{item.total.toLocaleString()}
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                        {editingId === idx ? (
                                                            <button onClick={saveEdit} style={{ color: 'var(--color-success)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                                <Save size={18} />
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => startEdit(idx)} style={{ color: 'var(--color-gray-400)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                                <Edit2 size={18} />
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleDelete(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot style={{ background: 'var(--color-gray-25)', fontWeight: 700 }}>
                                        <tr>
                                            <td colSpan={3} style={{ padding: '16px', textAlign: 'right' }}>Total Budget:</td>
                                            <td colSpan={2} style={{ padding: '16px', color: 'var(--color-primary)', fontSize: '16px' }}>
                                                <NairaSymbol />{totalBudget.toLocaleString()}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <Button variant="ghost" type="button" onClick={() => setStep('upload')}>Back</Button>
                                <Button
                                    variant="primary"
                                    onClick={handleFinalImport}
                                    disabled={isUploading || items.length === 0}
                                    style={{ minWidth: '150px', gap: '8px', display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                    {isUploading ? <Loader /> : (
                                        <>
                                            <CheckCircle2 size={18} />
                                            Commit {items.length} Items
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .pulse-loader {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.2); opacity: 0.1; }
                }
                .animate-bounce {
                    animation: bounce 1s infinite;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(-10%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                    50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
                }
                .btn-hover-effect:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    border-color: var(--color-accent-indigo);
                }
            `}</style>
        </>
    )
}
