import React from 'react';
import { Plus } from 'lucide-react';

interface Model {
    title: string;
    status: 'active' | 'inactive';
    tokensUsed: number;
    createdDate: string;
    engine: string;
}

interface ModelsProps {
    models: Model[];
}

const Models: React.FC<ModelsProps> = ({ models }) => {
    return (
        <div className="w-[90%] mx-auto mt-8">
            {models.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {models.map((model) => (
                        <div
                            key={model.title}
                            className="bg-[#0A0A0A] border-[1px] border-[#2a2a2a] rounded-xl p-4 flex flex-col gap-3"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-base tracking-tight font-medium text-white">{model.title}</span>
                                    <span
                                        className={`text-sm font-semibold ${
                                            model.status === 'active' ? 'text-[#00FF00]' : 'text-gray-400'
                                        }`}
                                    >
                                        {model.status}
                                    </span>
                                </div>
                                <div className="bg-[#161616] p-2 rounded-lg">
                                    <span className="text-sm text-[#2194FF]">{model.engine}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-400">Tokens used: {model.tokensUsed}</span>
                                <span className="text-sm text-gray-400">Created: {model.createdDate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[200px]  border-[1px] border-dotted border-[#2a2a2a] rounded-xl">
                    <span className="text-2xl tracking-tight font-medium text-white mb-2">Create your first project</span>
                    <span className="text-base text-gray-400 mb-4">Start by adding a new model</span>
                    <button className="flex items-center gap-2 font-medium border-[1px] rounded-full border-[#252525]  bg-[#090909] text-white px-4 py-2 cursor-pointer  hover:bg-[#2d2d2d] transition">
                        <Plus className="w-5 h-5" />
                        Add Model
                    </button>
                </div>
            )}
        </div>
    );
};

export default Models;
