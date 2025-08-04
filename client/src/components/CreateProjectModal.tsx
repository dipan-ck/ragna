"use client";

import React, { useState, useEffect } from "react";
import useCreateProjectModalStore from "@/store/createProjectModalStore";
import { FolderPlus } from 'lucide-react'; 
import AddProject from "./forms/AddProject";

const CreateProjectModal: React.FC = () => {
    const { isOpen, closeModal } = useCreateProjectModalStore();
    const [isMounted, setIsMounted] = useState(false);
    const [showModalContent, setShowModalContent] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isOpen) {
            setIsMounted(true);
            timeout = setTimeout(() => setShowModalContent(true), 10);
        } else {
            setShowModalContent(false);
            timeout = setTimeout(() => setIsMounted(false), 300); 
        }
        return () => clearTimeout(timeout);
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 z-50 bg-[#00000089] flex items-center justify-center transition-opacity duration-300 ${
                showModalContent ? "opacity-100 " : "opacity-0 backdrop-blur-0 pointer-events-none"
            }`}
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-[#070707] border border-[#2a2a2a] rounded-4xl p-8 w-[90%] max-w-xl text-white relative transform transition-all duration-300 ${
                    showModalContent ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
                }`}
            >
                <h2 className="text-3xl font-medium tracking-tight mb-2 flex items-center gap-2">
                    <FolderPlus className="w-8 h-8" />
                    Create New Project
                </h2>
                <p className="text-xs mb-8 text-gray-300">
                    Set up a new AI vector database project to start fine-tuning your models.
                </p>
                <AddProject closeModal={closeModal} />
            </div>
        </div>
    );
};

export default CreateProjectModal;