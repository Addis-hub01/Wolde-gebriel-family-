export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'contributor' | 'guest';
  linkedMemberId?: string; // Links this user to a node in the tree
  avatarUrl?: string;
  status: 'active' | 'pending';
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  deathDate?: string;
  gender: 'male' | 'female' | 'other';
  photoUrl: string;
  bio?: string;
  parentId?: string | null; // For tree structure (simplified parent pointer)
  spouseId?: string;
  location?: string;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  uploadedBy: string; // User ID
  dateUploaded: string;
  taggedMemberIds: string[];
  album?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string; // For DM
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  authorId: string;
  type: 'news' | 'event' | 'birthday';
}

// Tree Visualization Node extending FamilyMember for D3
export interface TreeNode extends FamilyMember {
  children?: TreeNode[];
}
