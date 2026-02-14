import React, { useState } from 'react';
import { FaCheck, FaPaperPlane, FaTimes, FaTimesCircle } from 'react-icons/fa';
import Button from '../ui/Button/Button';
import { User } from '@/types/User';
import Avatar from '../ui/Avatar';

type InviteMemberProps = {
  onSend: (receiveIds: string[]) => void;
  onSearch: (email: string) => void;
  isSearching: boolean;
  searchedUsers: User[] | null;
  alreadyMembers: User[]
  onClose: () => void;
};

export default function InviteMember({
  onSend, onClose,
  onSearch, isSearching, searchedUsers,
  alreadyMembers }: InviteMemberProps) {
  const [emailInput, setEmailInput] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);


  const handleSearch = () => {
    onSearch(emailInput);
  };

  const handleSelectUser = (user: User) => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers(prev => [...prev, user]);
    }
  };

  const handleRemoveSelected = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleSend = () => {
    const receiveIds = selectedUsers.map(u => u.id);
    onSend(receiveIds);
  };

  return (
    <div className="modal">
      <div className='modal-content flex flex-col'>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-base font-semibold text-gray-700">Invite to Board</span>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email address or User ID
              </label>
              <input
                autoFocus
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder="e.g. user@example.com"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-800 placeholder-gray-400"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>

            <Button
              onClick={handleSearch}
              title="Search"
              disabled={!emailInput.trim()}
              style="bg-blue-600 hover:bg-blue-700 text-white"
            />
          </div>
        </div>

        {/* Searched Users Area*/}

        <div className="min-h-[150px] max-h-[200px] overflow-y-auto border border-gray-100 rounded-lg bg-gray-50 p-1 custom-scrollbar">
          {isSearching ? (
            <div className="flex justify-center items-center h-full text-gray-400 text-sm gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              Searching...
            </div>
          ) : searchedUsers ? (
            searchedUsers.length > 0 ? (
              <div className="space-y-1">
                {searchedUsers.map((user) => {
                  const isAlreadyMember = alreadyMembers.some(m => m.id === user.id);
                  
                  if (isAlreadyMember) return null;

                  const isSelected = selectedUsers.some(u => u.id === user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${isSelected ? 'bg-blue-50 border border-blue-100' : 'hover:bg-white hover:shadow-sm'
                        }`}
                    >

                      <Avatar user={user} />

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      {/* Check */}
                      {isSelected && <FaCheck className="text-blue-600" size={14} />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-400 text-sm">No users found</div>
            )
          ) : (
            <div className="flex justify-center items-center h-full text-gray-400 text-sm">
              Enter email to search
            </div>
          )}
        </div>

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase">
              Selected ({selectedUsers.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(u => (
                <div key={u.id} className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  {u.name}
                  <button onClick={() => handleRemoveSelected(u.id)} className="cursor-pointer hover:text-blue-900">
                    <FaTimesCircle />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleSend}
          title={selectedUsers.length > 0 ? "Send Invitations" : "Select users to invite"}
          icon={FaPaperPlane}
          disabled={selectedUsers.length === 0}
          style="bg-pink-600 hover:bg-pink-700 text-white mt-2 self-end"
        />
      </div>
    </div>
  );
}