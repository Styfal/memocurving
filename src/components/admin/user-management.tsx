import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const userList: User[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const createdAt = data.createdAt?.seconds 
            ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() 
            : 'N/A';
          return { id: doc.id, ...data, createdAt } as User;
        });
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
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

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.createdAt}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="bg-red-500 text-white p-2" onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
