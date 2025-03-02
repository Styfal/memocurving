// import { useEffect, useState } from 'react';
// import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import { useRouter } from 'next/navigation';

// <<<<<<< HEAD
// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "@/lib/firebase";

// interface ContentManagementProps {
//   setNotification: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error'; message: string } | null>>;
// }

// export default function ContentManagement({ 
//   setNotification 
// }: ContentManagementProps) {
//   // Updated state type and default value to match Firestore collection 'cardSets'
//   const [contentType, setContentType] = useState<'cardSets' | 'tests'>('cardSets');
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSearch = async () => {
//     try {
//       // Reference the correct Firestore collection based on contentType
//       const collectionRef = collection(db, contentType);
      
//       // Build a query based on a field. Adjust the field name (e.g., 'title') to match your data.
//       const q = query(collectionRef, where("title", "==", searchTerm));

//       const querySnapshot = await getDocs(q);
//       let resultsCount = querySnapshot.size;

//       // Example: Notify the user about the number of results found
//       setNotification({
//         type: 'success',
//         message: `Found ${resultsCount} ${contentType} for "${searchTerm}".`
//       });
      
//       // Process the results if needed
//       querySnapshot.forEach((doc) => {
//         console.log(doc.id, " => ", doc.data());
//       });
      
//     } catch (error) {
//       console.error("Error searching:", error);
//       setNotification({
//         type: 'error',
//         message: 'Search failed'
//       });
// =======
// interface User {
//   id: string;
//   username: string;
//   email: string;
//   role: 'admin' | 'user' | 'moderator';
//   createdAt: string;
// }

// interface CardSet {
//   id: string;
//   title: string;
//   createdBy?: string;  // Made optional
//   uid?: string;        // Added uid field as optional
// }

// interface TestSet {
//   id: string;
//   title: string;
//   userId: string;
// }

// const UserManagement = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [cardSets, setCardSets] = useState<CardSet[]>([]);
//   const [testSets, setTestSets] = useState<TestSet[]>([]);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [expandedUser, setExpandedUser] = useState<string | null>(null);
  
//   const db = getFirestore();
//   const auth = getAuth();
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'users'));
//         const userList: User[] = querySnapshot.docs.map(docSnap => {
//           const data = docSnap.data();
//           const createdAt = data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';
//           return { id: docSnap.id, ...data, createdAt } as User;
//         });
//         setUsers(userList);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     const fetchCardSets = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'cardSets'));
//         const cardSetsList = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as CardSet));
//         setCardSets(cardSetsList);
//       } catch (error) {
//         console.error('Error fetching card sets:', error);
//       }
//     };

//     const fetchTestSets = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'tests'));
//         const testSetsList = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as TestSet));
//         setTestSets(testSetsList);
//       } catch (error) {
//         console.error('Error fetching tests:', error);
//       }
//     };

//     fetchUsers();
//     fetchCardSets();
//     fetchTestSets();
//   }, [db]);

//   const handleCreateUser = async () => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       console.log('User created:', userCredential.user);
//       setEmail('');
//       setPassword('');
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error('Error creating user:', error.message);
//       } else {
//         console.error('An unknown error occurred');
//       }
// >>>>>>> ccdba64cda2cfd02d5fdd69b324a6b48dbcef063
//     }
//   };

//   const handleDeleteUser = async (userId: string) => {
//     try {
//       await deleteDoc(doc(db, 'users', userId));
//       setUsers(users.filter(user => user.id !== userId));
//       console.log('User deleted');
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error('Error deleting user:', error.message);
//       } else {
//         console.error('An unknown error occurred');
//       }
//     }
//   };

//   const handleDeleteCardSet = async (cardSetId: string) => {
//     try {
//       await deleteDoc(doc(db, 'cardSets', cardSetId));
//       setCardSets(cardSets.filter(set => set.id !== cardSetId));
//     } catch (error) {
//       console.error('Error deleting card set:', error);
//     }
//   };

//   const handleDeleteTest = async (testId: string) => {
//     try {
//       await deleteDoc(doc(db, 'tests', testId));
//       setTestSets(testSets.filter(test => test.id !== testId));
//     } catch (error) {
//       console.error('Error deleting test:', error);
//     }
//   };

//   const navigateToCardSet = (cardSetId: string) => {
//     router.push(`/cards/${cardSetId}`);
//   };

//   const navigateToTest = (testId: string) => {
//     router.push(`/tests/${testId}`);
//   };

//   const toggleUserExpand = (userId: string) => {
//     setExpandedUser(expandedUser === userId ? null : userId);
//   };

//   const getUserCardSets = (userId: string) => {
//     return cardSets.filter(set => set.uid === userId || set.createdBy === userId);
//   };

//   const getUserTests = (userId: string) => {
//     return testSets.filter(test => test.userId === userId);
//   };

//   return (
// <<<<<<< HEAD
//     <div className="space-y-4">
//       <div className="flex space-x-4">
//         <select 
//           value={contentType}
//           onChange={(e) => setContentType(e.target.value as 'cardSets' | 'tests')}
//           className="p-2 border rounded"
//         >
//           <option value="cardSets">Card Sets</option>
//           <option value="tests">Test Sets</option>
//         </select>
//         <Input 
//           placeholder={`Search ${contentType}`}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <Button onClick={handleSearch}>Search</Button>
// =======
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>
      
//       {/* User creation form */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//         <h2 className="text-xl font-bold mb-4 text-gray-700">Create New User</h2>
//         <div className="flex flex-col md:flex-row gap-4">
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             className="flex-1 p-2 border rounded"
//           />
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             className="flex-1 p-2 border rounded"
//           />
//           <button
//             onClick={handleCreateUser}
//             className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//           >
//             Create User
//           </button>
//         </div>
// >>>>>>> ccdba64cda2cfd02d5fdd69b324a6b48dbcef063
//       </div>
      
//       {/* Users list with expandable sections */}
//       <div className="bg-white rounded-lg shadow-md">
//         <h2 className="text-xl font-bold p-4 border-b text-gray-700">Users</h2>
//         <div className="divide-y divide-gray-200">
//           {users.map(user => {
//             const userCardSets = getUserCardSets(user.id);
//             const userTests = getUserTests(user.id);
//             const isExpanded = expandedUser === user.id;
//             const hasContent = userCardSets.length > 0 || userTests.length > 0;
            
//             return (
//               <div key={user.id} className="transition-all duration-200">
//                 <div 
//                   className={`p-4 flex flex-col md:flex-row md:items-center justify-between ${hasContent ? 'cursor-pointer hover:bg-gray-50' : ''}`}
//                   onClick={hasContent ? () => toggleUserExpand(user.id) : undefined}
//                 >
//                   <div className="flex-1 mb-2 md:mb-0">
//                     <div className="font-medium text-gray-800">{user.username}</div>
//                     <div className="text-sm text-gray-500">{user.email}</div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{user.role}</span>
//                     <span className="text-xs text-gray-500">Created: {user.createdAt}</span>
//                     {hasContent && (
//                       <button className="text-blue-500">
//                         {isExpanded ? '↑ Hide' : '↓ Show'} ({userCardSets.length + userTests.length})
//                       </button>
//                     )}
//                     <button 
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDeleteUser(user.id);
//                       }} 
//                       className="ml-2 text-red-500 hover:text-red-700"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
                
//                 {isExpanded && (
//                   <div className="pl-8 pr-4 pb-4 bg-gray-50 border-t border-gray-100">
//                     {userCardSets.length > 0 && (
//                       <div className="mb-4">
//                         <h3 className="text-md font-medium mb-2 text-gray-700">Card Sets</h3>
//                         <div className="space-y-2">
//                           {userCardSets.map(set => (
//                             <div key={set.id} className="bg-white p-3 rounded border flex justify-between items-center">
//                               <span className="font-medium">{set.title}</span>
//                               <div>
//                                 <button 
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     navigateToCardSet(set.id);
//                                   }} 
//                                   className="text-blue-500 hover:text-blue-700 mr-3"
//                                 >
//                                   View
//                                 </button>
//                                 <button 
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleDeleteCardSet(set.id);
//                                   }} 
//                                   className="text-red-500 hover:text-red-700"
//                                 >
//                                   Delete
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
                    
//                     {userTests.length > 0 && (
//                       <div>
//                         <h3 className="text-md font-medium mb-2 text-gray-700">Test Sets</h3>
//                         <div className="space-y-2">
//                           {userTests.map(test => (
//                             <div key={test.id} className="bg-white p-3 rounded border flex justify-between items-center">
//                               <span className="font-medium">{test.title}</span>
//                               <div>
//                                 <button 
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     navigateToTest(test.id);
//                                   }} 
//                                   className="text-blue-500 hover:text-blue-700 mr-3"
//                                 >
//                                   View
//                                 </button>
//                                 <button 
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleDeleteTest(test.id);
//                                   }} 
//                                   className="text-red-500 hover:text-red-700"
//                                 >
//                                   Delete
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
                    
//                     {userCardSets.length === 0 && userTests.length === 0 && (
//                       <div className="text-gray-500 italic text-sm">No content for this user</div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
          
//           {users.length === 0 && (
//             <div className="p-4 text-gray-500 italic">No users found</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// <<<<<<< HEAD
// }
// =======
// };

// export default UserManagement;
// >>>>>>> ccdba64cda2cfd02d5fdd69b324a6b48dbcef063


import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";

interface ContentManagementProps {
  setNotification: React.Dispatch<React.SetStateAction<{ type: 'success' | 'error'; message: string } | null>>;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: string;
}

interface CardSet {
  id: string;
  title: string;
  createdBy?: string;
  uid?: string;
}

interface TestSet {
  id: string;
  title: string;
  userId: string;
}

export default function ContentManagement({ setNotification }: ContentManagementProps) {
  // Content search state
  const [contentType, setContentType] = useState<'cardSets' | 'tests'>('cardSets');
  const [searchTerm, setSearchTerm] = useState('');

  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [testSets, setTestSets] = useState<TestSet[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    // Fetch users
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userList: User[] = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data();
          const createdAt = data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';
          return { id: docSnap.id, ...data, createdAt } as User;
        });
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Fetch card sets
    const fetchCardSets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cardSets'));
        const cardSetsList = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as CardSet));
        setCardSets(cardSetsList);
      } catch (error) {
        console.error('Error fetching card sets:', error);
      }
    };

    // Fetch test sets
    const fetchTestSets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tests'));
        const testSetsList = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as TestSet));
        setTestSets(testSetsList);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchUsers();
    fetchCardSets();
    fetchTestSets();
  }, []);

  const handleSearch = async () => {
    try {
      const collectionRef = collection(db, contentType);
      const q = query(collectionRef, where("title", "==", searchTerm));
      const querySnapshot = await getDocs(q);
      const resultsCount = querySnapshot.size;

      setNotification({
        type: 'success',
        message: `Found ${resultsCount} ${contentType} for "${searchTerm}".`
      });

      querySnapshot.forEach((docSnap) => {
        console.log(docSnap.id, " => ", docSnap.data());
      });
    } catch (error) {
      console.error("Error searching:", error);
      setNotification({
        type: 'error',
        message: 'Search failed'
      });
    }
  };

  const handleCreateUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user);
      setEmail('');
      setPassword('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error creating user:', error.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
      console.log('User deleted');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error deleting user:', error.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  const handleDeleteCardSet = async (cardSetId: string) => {
    try {
      await deleteDoc(doc(db, 'cardSets', cardSetId));
      setCardSets(cardSets.filter(set => set.id !== cardSetId));
    } catch (error) {
      console.error('Error deleting card set:', error);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    try {
      await deleteDoc(doc(db, 'tests', testId));
      setTestSets(testSets.filter(test => test.id !== testId));
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  const navigateToCardSet = (cardSetId: string) => {
    router.push(`/cards/${cardSetId}`);
  };

  const navigateToTest = (testId: string) => {
    router.push(`/tests/${testId}`);
  };

  const toggleUserExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const getUserCardSets = (userId: string) => {
    return cardSets.filter(set => set.uid === userId || set.createdBy === userId);
  };

  const getUserTests = (userId: string) => {
    return testSets.filter(test => test.userId === userId);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Content Search Section */}
      <div className="space-y-4 mb-8">
        <div className="flex space-x-4">
          <select 
            value={contentType}
            onChange={(e) => setContentType(e.target.value as 'cardSets' | 'tests')}
            className="p-2 border rounded"
          >
            <option value="cardSets">Card Sets</option>
            <option value="tests">Test Sets</option>
          </select>
          <Input 
            placeholder={`Search ${contentType}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {/* User Management Section */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Create New User</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="flex-1 p-2 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleCreateUser}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Create User
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold p-4 border-b text-gray-700">Users</h2>
        <div className="divide-y divide-gray-200">
          {users.map(user => {
            const userCardSets = getUserCardSets(user.id);
            const userTests = getUserTests(user.id);
            const isExpanded = expandedUser === user.id;
            const hasContent = userCardSets.length > 0 || userTests.length > 0;
            
            return (
              <div key={user.id} className="transition-all duration-200">
                <div 
                  className={`p-4 flex flex-col md:flex-row md:items-center justify-between ${hasContent ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  onClick={hasContent ? () => toggleUserExpand(user.id) : undefined}
                >
                  <div className="flex-1 mb-2 md:mb-0">
                    <div className="font-medium text-gray-800">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{user.role}</span>
                    <span className="text-xs text-gray-500">Created: {user.createdAt}</span>
                    {hasContent && (
                      <button className="text-blue-500">
                        {isExpanded ? '↑ Hide' : '↓ Show'} ({userCardSets.length + userTests.length})
                      </button>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user.id);
                      }} 
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="pl-8 pr-4 pb-4 bg-gray-50 border-t border-gray-100">
                    {userCardSets.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-md font-medium mb-2 text-gray-700">Card Sets</h3>
                        <div className="space-y-2">
                          {userCardSets.map(set => (
                            <div key={set.id} className="bg-white p-3 rounded border flex justify-between items-center">
                              <span className="font-medium">{set.title}</span>
                              <div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigateToCardSet(set.id);
                                  }} 
                                  className="text-blue-500 hover:text-blue-700 mr-3"
                                >
                                  View
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCardSet(set.id);
                                  }} 
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {userTests.length > 0 && (
                      <div>
                        <h3 className="text-md font-medium mb-2 text-gray-700">Test Sets</h3>
                        <div className="space-y-2">
                          {userTests.map(test => (
                            <div key={test.id} className="bg-white p-3 rounded border flex justify-between items-center">
                              <span className="font-medium">{test.title}</span>
                              <div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigateToTest(test.id);
                                  }} 
                                  className="text-blue-500 hover:text-blue-700 mr-3"
                                >
                                  View
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTest(test.id);
                                  }} 
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {userCardSets.length === 0 && userTests.length === 0 && (
                      <div className="text-gray-500 italic text-sm">No content for this user</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          
          {users.length === 0 && (
            <div className="p-4 text-gray-500 italic">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
}
