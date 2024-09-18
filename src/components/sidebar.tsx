import { Button } from "@/components/ui/button"
import { PlusIcon, EditIcon, BookOpenIcon, BrainIcon } from 'lucide-react'

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-md p-4">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Flashcards</h2>
      <nav className="space-y-2">
        <Button
          variant={currentPage === 'create' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setCurrentPage('create')}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Card Set
        </Button>
        <Button
          variant={currentPage === 'edit' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setCurrentPage('edit')}
        >
          <EditIcon className="mr-2 h-4 w-4" />
          Edit Card Sets
        </Button>
        <Button
          variant={currentPage === 'test' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setCurrentPage('test')}
        >
          <BookOpenIcon className="mr-2 h-4 w-4" />
          Test Create
        </Button>
        <Button
          variant={currentPage === 'ai' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setCurrentPage('ai')}
        >
          <BrainIcon className="mr-2 h-4 w-4" />
          AI Create
        </Button>
      </nav>
    </div>
  )
}