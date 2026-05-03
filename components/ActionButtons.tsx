import { Pencil, Trash2 } from "lucide-react";

interface ActionButtonsProps {
	onEdit: () => void;
	onDelete: () => void;
}

export default function ActionButtons({
	onEdit,
	onDelete,
}: ActionButtonsProps) {
	return (
		<div className='flex items-center gap-1'>
			<button
				onClick={onEdit}
				className='w-8 h-8 rounded-md flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 transition-colors'
				title='Edit'
			>
				<Pencil className='w-3.5 h-3.5' />
			</button>
			<button
				onClick={onDelete}
				className='w-8 h-8 rounded-md flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors'
				title='Delete'
			>
				<Trash2 className='w-3.5 h-3.5' />
			</button>
		</div>
	);
}
