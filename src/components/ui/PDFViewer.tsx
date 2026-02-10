import { FileText, ExternalLink, Download } from 'lucide-react';

interface PDFViewerProps {
    url: string;
    title?: string;
}

export default function PDFViewer({ url, title }: PDFViewerProps) {
    if (!url) {
        return (
            <div style={{
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-gray-50)',
                borderRadius: 'var(--radius-lg)',
                border: '2px dashed var(--color-gray-200)',
                color: 'var(--color-gray-400)'
            }}>
                <FileText size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ fontWeight: 500 }}>No document available</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%' }}>
            <div style={{
                position: 'relative',
                width: '100%',
                height: '500px',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)',
                overflow: 'hidden'
            }}>
                <iframe
                    src={`${url}#toolbar=0&navpanes=0&view=FitH`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title={title || "PDF Document"}
                    loading="lazy"
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <ExternalLink size={14} /> Full Screen
                </a>
                <a
                    href={url}
                    download
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: 'white',
                        color: 'var(--color-primary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-primary)',
                        textDecoration: 'none',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Download size={14} /> Download PDF
                </a>
            </div>
        </div>
    );
}
