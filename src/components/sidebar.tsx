// import { Button } from "@/components/ui/button"
// import { PlusIcon, BookOpenIcon, BrainIcon } from 'lucide-react'

// interface SidebarProps {
//   currentPage: string;
//   setCurrentPage: (page: string) => void;
// }

// export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
//   return (
//     <div className="w-64 bg-white shadow-md p-4 mt-16">
//       <nav className="space-y-2">
//         <Button
//           variant={currentPage === 'create' ? 'default' : 'ghost'}
//           className="w-full justify-start"
//           onClick={() => setCurrentPage('create')}
//         >
//           <PlusIcon className="mr-2 h-4 w-4" />
//           Create Card Set
//         </Button>
//         <Button
//           variant={currentPage === 'test' ? 'default' : 'ghost'}
//           className="w-full justify-start"
//           onClick={() => setCurrentPage('test')}
//         >
//           <BookOpenIcon className="mr-2 h-4 w-4" />
//           Test Create
//         </Button>
//         <Button
//           variant={currentPage === 'ai' ? 'default' : 'ghost'}
//           className="w-full justify-start"
//           onClick={() => setCurrentPage('ai')}
//         >
//           <BrainIcon className="mr-2 h-4 w-4" />
//           AI Create
//         </Button>
//       </nav>
//     </div>
//   )
// }

import { Button } from "@/components/ui/button"
import { PlusIcon, BookOpenIcon, BrainIcon } from 'lucide-react'

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  return (
    <div className="fixed top-16 left-0 w-64 h-[calc(100%-4rem)] bg-white shadow-md p-6">
      <nav className="space-y-4">
        <Button
          variant={currentPage === 'create' ? 'default' : 'ghost'}
          className="w-full justify-start transition-colors duration-200 text-xl py-3"
          onClick={() => setCurrentPage('create')}
        >
          <PlusIcon className="mr-3 h-6 w-6" />
          Create Card Set
        </Button>
        <Button
          variant={currentPage === 'test' ? 'default' : 'ghost'}
          className="w-full justify-start transition-colors duration-200 text-xl py-3"
          onClick={() => setCurrentPage('test')}
        >
          <BookOpenIcon className="mr-3 h-6 w-6" />
          Test Create
        </Button>
        <Button
          variant={currentPage === 'ai' ? 'default' : 'ghost'}
          className="w-full justify-start transition-colors duration-200 text-xl py-3"
          onClick={() => setCurrentPage('ai')}
        >
          <BrainIcon className="mr-3 h-6 w-6" />
          AI Create
        </Button>
      </nav>
    </div>
  )
}
