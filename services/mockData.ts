import { FamilyMember, User, Photo, Announcement, Message } from '../types';

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: 'root',
    firstName: 'Gebriel',
    lastName: 'Wolde',
    gender: 'male',
    birthDate: '1940-05-15',
    location: 'Addis Ababa, Ethiopia',
    photoUrl: 'https://picsum.photos/id/1005/200/200',
    bio: 'The patriarch of the family. A wise man who loved history.',
    parentId: null,
  },
  {
    id: 'child1',
    firstName: 'Wolde',
    lastName: 'Gebriel',
    gender: 'male',
    birthDate: '1965-08-20',
    location: 'London, UK',
    photoUrl: 'https://picsum.photos/id/1012/200/200',
    parentId: 'root',
  },
  {
    id: 'child2',
    firstName: 'Almaz',
    lastName: 'Gebriel',
    gender: 'female',
    birthDate: '1968-11-10',
    location: 'Washington DC, USA',
    photoUrl: 'https://picsum.photos/id/1027/200/200',
    parentId: 'root',
  },
  {
    id: 'grandchild1',
    firstName: 'Dawit',
    lastName: 'Wolde',
    gender: 'male',
    birthDate: '1995-02-14',
    location: 'London, UK',
    photoUrl: 'https://picsum.photos/id/338/200/200',
    parentId: 'child1',
  },
  {
    id: 'grandchild2',
    firstName: 'Sara',
    lastName: 'Wolde',
    gender: 'female',
    birthDate: '1998-06-22',
    location: 'Toronto, Canada',
    photoUrl: 'https://picsum.photos/id/349/200/200',
    parentId: 'child1',
  },
  {
    id: 'grandchild3',
    firstName: 'Yonas',
    lastName: 'Bekele', // Son of Almaz
    gender: 'male',
    birthDate: '2001-09-05',
    location: 'Seattle, USA',
    photoUrl: 'https://picsum.photos/id/433/200/200',
    parentId: 'child2',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Dawit Wolde',
    email: 'dawit@example.com',
    role: 'admin',
    linkedMemberId: 'grandchild1',
    avatarUrl: 'https://picsum.photos/id/338/100/100',
    status: 'active',
  },
  {
    id: 'u2',
    name: 'Sara Wolde',
    email: 'sara@example.com',
    role: 'contributor',
    linkedMemberId: 'grandchild2',
    avatarUrl: 'https://picsum.photos/id/349/100/100',
    status: 'active',
  },
];

export const INITIAL_PHOTOS: Photo[] = [
  {
    id: 'p1',
    url: 'https://picsum.photos/id/10/800/600',
    caption: 'Family Reunion 2018',
    uploadedBy: 'u1',
    dateUploaded: '2018-07-15',
    taggedMemberIds: ['root', 'child1', 'child2'],
    album: 'Reunions',
  },
  {
    id: 'p2',
    url: 'https://picsum.photos/id/13/800/600',
    caption: 'Summer Vacation at Lake Tana',
    uploadedBy: 'u2',
    dateUploaded: '2019-08-20',
    taggedMemberIds: ['grandchild1', 'grandchild2'],
    album: 'Vacations',
  },
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: 'u2',
    receiverId: 'u1',
    content: 'Hey Dawit, do you have the photos from grandma\'s birthday?',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: true,
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Upcoming Family Reunion',
    content: 'The 2024 annual Wolde Gebriel family reunion will be held in Addis Ababa this December! Please RSVP.',
    date: new Date().toISOString(),
    authorId: 'u1',
    type: 'event',
  },
  {
    id: 'a2',
    title: 'Happy Birthday Gebriel!',
    content: 'Wishing a wonderful birthday to our grandfather Gebriel.',
    date: new Date(Date.now() - 172800000).toISOString(),
    authorId: 'u2',
    type: 'birthday',
  }
];
