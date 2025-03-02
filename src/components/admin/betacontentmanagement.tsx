import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

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
  createdBy: string;
}

interface TestSet {
  id: string;
  title: string;
  userId: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [testSets, setTestSets] = useState<TestSet[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const db = getFirestore();
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
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

    const fetchCardSets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cardSets'));
        const cardSetsList = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as CardSet));
        setCardSets(cardSetsList);
      } catch (error) {
        console.error('Error fetching card sets:', error);
      }
    };

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
  }, [db]);

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

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => handleDeleteUser(user.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mt-6">Card Sets</h2>
      {cardSets.map(set => (
        <div key={set.id} className="p-4 border rounded mb-2 flex justify-between">
          <span>{set.title}</span>
          <div>
            <button onClick={() => navigateToCardSet(set.id)} className="text-blue-500 mr-2">View</button>
            <button onClick={() => handleDeleteCardSet(set.id)} className="text-red-500">Delete</button>
          </div>
        </div>
      ))}

      <h2 className="text-xl font-bold mt-6">Test Sets</h2>
      {testSets.map(test => (
        <div key={test.id} className="p-4 border rounded mb-2 flex justify-between">
          <span>{test.title}</span>
          <div>
            <button onClick={() => navigateToTest(test.id)} className="text-blue-500 mr-2">View</button>
            <button onClick={() => handleDeleteTest(test.id)} className="text-red-500">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserManagement;
