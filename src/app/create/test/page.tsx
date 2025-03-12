// "use client"

// import TestCreate from "@/components/test-create"

// export default function TestCreatePage() {
//   return (
//     <div className="p-4">
//       <TestCreate />
//     </div>
//   )
// }



"use client"

import { useState } from 'react'
import TestCreate, { FreeTestSet, FlashcardTestSet } from "@/components/test-create"

export default function TestCreatePage() {
  const [testSets, setTestSets] = useState<(FreeTestSet | FlashcardTestSet)[]>([])

  return (
    <div className="p-4">
      <TestCreate setTestSets={setTestSets} />
    </div>
  )
}
