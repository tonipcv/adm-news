'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface Comment {
  id: number;
  text: string;
  timestamp: string;
  image?: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = true;

  // Simular dados do usuário (em uma app real viria da autenticação)
  const currentUser = {
    name: "Admin User",
    avatar: "/default-avatar.png", // Adicione uma imagem default no diretório public
    username: "admin"
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addComment = () => {
    if (!newComment.trim() && !selectedImage) return;
    
    const comment: Comment = {
      id: Date.now(),
      text: newComment,
      timestamp: new Date().toLocaleString(),
      image: selectedImage || undefined,
      author: currentUser
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const deleteComment = (id: number) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  return (
    <div>
      <div className="border border-gray-200 p-4 mb-4">
        <div className="flex gap-3">
          <Image
            src={currentUser.avatar}
            alt="Avatar"
            width={48}
            height={48}
            className="rounded-full h-12 w-12"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 min-h-[100px] text-xl border-none resize-none focus:outline-none bg-transparent"
              placeholder="O que está acontecendo?"
            />
            {selectedImage && (
              <div className="relative mt-2">
                <Image
                  src={selectedImage}
                  alt="Upload Preview"
                  width={500}
                  height={300}
                  className="rounded-2xl max-h-[300px] w-auto object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex justify-between items-center mt-4 border-t pt-4">
              <div className="flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </label>
              </div>
              <button
                onClick={addComment}
                disabled={!newComment.trim() && !selectedImage}
                className="px-4 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border-b hover:bg-gray-50">
            <div className="flex gap-3">
              <Image
                src={comment.author.avatar}
                alt={comment.author.name}
                width={48}
                height={48}
                className="rounded-full h-12 w-12"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{comment.author.name}</span>
                    <span className="text-gray-500">@{comment.author.username}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500">{comment.timestamp}</span>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="mt-1 text-gray-900">{comment.text}</p>
                {comment.image && (
                  <div className="mt-3">
                    <Image
                      src={comment.image}
                      alt="Comment image"
                      width={500}
                      height={300}
                      className="rounded-2xl max-h-[300px] w-auto object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 