'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    variant?: 'danger' | 'primary';
}

export const Dialog: React.FC<DialogProps> = ({
    open,
    onClose,
    title,
    description,
    children,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    variant = 'primary'
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (open) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    if (!isVisible && !open) return null;

    // Use Portal to render at document.body level ensures it's always centered on screen
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className={`
                relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6
                transform transition-all duration-200
                ${open ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
            `}>
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-gray-400 leading-relaxed">
                            {description}
                        </p>
                    )}
                    {children}
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        className="hover:bg-gray-800 text-gray-300"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}
                        variant={variant}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};
