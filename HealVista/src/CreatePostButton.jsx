import { useState, useEffect } from 'react';
import { X, Plus, Upload, Link as LinkIcon, BarChart } from 'lucide-react';

// CreatePostButton component that can be reused
export function CreatePostButton({ onPostCreated, currentUser = { name: "You", avatar: "./images/pfp2.jpg" } }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  
  // Form fields for all post types
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [tags, setTags] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  
  // Poll specific fields
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState('1 day');

  // Animation control for tabs
  const [tabChangeAnimation, setTabChangeAnimation] = useState(false);

  // For smooth modal opening and closing
  useEffect(() => {
    let timeout;
    if (isModalVisible) {
      // Slight delay to allow the backdrop to start appearing first
      timeout = setTimeout(() => {
        setIsModalOpen(true);
      }, 50);
    } 
    return () => clearTimeout(timeout);
  }, [isModalVisible]);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Delay hiding the modal container until after animation completes
    setTimeout(() => {
      setIsModalVisible(false);
    }, 300); // Match this with your CSS transition duration
  };

  // Tab changing with animation
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    
    setTabChangeAnimation(true);
    
    // Short delay to allow fade out before changing tab content
    setTimeout(() => {
      setActiveTab(tab);
      // Reset animation state
      setTimeout(() => {
        setTabChangeAnimation(false);
      }, 50);
    }, 150);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a unique ID for the new post
    const postId = Date.now();
    
    // Create the base post object
    const newPost = {
      id: postId,
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      title,
      timestamp: new Date().toISOString(), // Use actual timestamp for sorting
      displayTime: "Just now",
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      comments: [],
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    };
    
    // Add type-specific content
    switch (activeTab) {
      case 'text':
        newPost.type = 'text';
        newPost.content = content;
        break;
      case 'media':
        newPost.type = 'media';
        newPost.content = "Shared media";
        // Create object URLs for uploaded files or use placeholders
        newPost.image = mediaFiles.length > 0 
          ? URL.createObjectURL(mediaFiles[0]) 
          : "/api/placeholder/500/300";
        break;
      case 'link':
        newPost.type = 'link';
        newPost.content = "Shared link: " + linkUrl;
        newPost.linkUrl = linkUrl;
        break;
      case 'poll':
        newPost.type = 'poll';
        // Filter out empty options
        const validOptions = pollOptions.filter(option => option.trim() !== '');
        newPost.content = "Created a poll";
        newPost.isPoll = true;
        newPost.pollOptions = validOptions.map(option => ({
          text: option,
          votes: 0
        }));
        newPost.pollDuration = pollDuration;
        newPost.pollTotalVotes = 0;
        newPost.userVoted = false;
        break;
    }
    
    // Pass the new post to the parent component
    if (onPostCreated) {
      onPostCreated(newPost);
    } else {
      console.warn("onPostCreated prop is not provided to CreatePostButton component");
    }
    
    // Reset form fields
    setTitle('');
    setContent('');
    setLinkUrl('');
    setTags('');
    setMediaFiles([]);
    setPollOptions(['', '']);
    setPollDuration('1 day');
    
    // Close the modal with animation
    closeModal();
  };
  
  const handleMediaUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setMediaFiles(Array.from(e.target.files));
    }
  };
  
  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };
  
  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    }
  };
  
  const updatePollOption = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  return (
    <>
      <button 
        onClick={openModal}
        className="flex items-center bg-gradient-to-r from-pink-800 to-orange-300 text-white px-4 py-2 rounded-md hover:from-pink-900 hover:to-orange-400 transition duration-300 transform hover:scale-105 shadow-lg"
      >
        <Plus size={18} className="mr-2" />
        Create
      </button>

      {/* Create Post Modal */}
      {isModalVisible && (
        <div 
          className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-all duration-300 ease-in-out ${
            isModalOpen ? 'bg-opacity-80 backdrop-blur-sm' : 'bg-opacity-0 backdrop-blur-none'
          }`}
          onClick={(e) => {
            // Close when clicking backdrop, but not when clicking modal
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div 
            className={`bg-gradient-to-br from-gray-900 to-black rounded-lg w-full max-w-xl relative border border-gray-800 flex flex-col transition-all duration-300 ease-in-out ${
              isModalOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-4'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-800 p-4">
              <h2 className="text-xl font-medium text-white">Create post</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white hover:rotate-90 transform transition-all duration-300"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              <button 
                onClick={() => handleTabChange('text')} 
                className={px-4 py-2 text-center flex-1 transition-all duration-300 ${activeTab === 'text' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}}
              >
                Text
              </button>
              <button 
                onClick={() => handleTabChange('media')} 
                className={px-4 py-2 text-center flex-1 transition-all duration-300 ${activeTab === 'media' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}}
              >
                Images & Video
              </button>
              <button 
                onClick={() => handleTabChange('link')} 
                className={px-4 py-2 text-center flex-1 transition-all duration-300 ${activeTab === 'link' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}}
              >
                Link
              </button>
              <button 
                onClick={() => handleTabChange('poll')} 
                className={px-4 py-2 text-center flex-1 transition-all duration-300 ${activeTab === 'poll' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}}
              >
                Poll
              </button>
            </div>

            {/* Tab Content with fade transition */}
            <div className={transition-opacity duration-200 ease-in-out ${tabChangeAnimation ? 'opacity-0' : 'opacity-100'}}>
              <form onSubmit={handleSubmit} className="p-4 flex-1 overflow-y-auto">
                {/* Title Field (common to all tabs) */}
                <input
                  type="text"
                  placeholder="Title*"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-md p-2 mb-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                />
                
                <div className="text-right text-xs text-gray-400 -mt-3 mb-2">
                  {title.length}/300
                </div>

                {/* Tags input */}
                <input
                  type="text"
                  placeholder="Add tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-gray-800 bg-opacity-50 rounded-md p-2 mb-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                />

                {/* Text Tab Content */}
                {activeTab === 'text' && (
                  <div className="border border-gray-700 rounded-md p-2 min-h-32 mb-4 transition-all duration-200 hover:border-gray-600">
                    <textarea
                      placeholder="Body text (optional)"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full bg-transparent min-h-24 text-white focus:outline-none resize-none"
                    />
                  </div>
                )}

                {/* Media Tab Content */}
                {activeTab === 'media' && (
                  <div className="border border-gray-700 border-dashed rounded-md p-8 min-h-32 mb-4 flex items-center justify-center flex-col transition-all duration-300 hover:border-blue-500 hover:bg-blue-900 hover:bg-opacity-5">
                    <input
                      type="file"
                      id="media-upload"
                      accept="image/,video/"
                      multiple
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                    <label 
                      htmlFor="media-upload"
                      className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                    >
                      <Upload size={24} className="text-gray-400 mb-2 transition-transform duration-300 group-hover:scale-110" />
                      <p className="text-gray-400 text-center mb-2">Drag and Drop or upload media</p>
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-800 rounded-md text-white hover:bg-gray-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                      >
                        Select Files
                      </button>
                    </label>
                    
                    {mediaFiles.length > 0 && (
                      <div className="mt-4 w-full animate-fadeIn">
                        <p className="text-gray-300 mb-2">Selected files ({mediaFiles.length}):</p>
                        <ul className="text-gray-400 text-sm">
                          {mediaFiles.map((file, index) => (
                            <li key={index} className="truncate animate-slideIn" style={{animationDelay: ${index * 100}ms}}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Link Tab Content */}
                {activeTab === 'link' && (
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="Link URL *"
                        required
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="w-full bg-transparent border border-gray-700 rounded-md p-2 pl-9 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                      />
                      <LinkIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>
                )}

                {/* Poll Tab Content */}
                {activeTab === 'poll' && (
                  <div className="mb-4">
                    <div className="border border-gray-700 rounded-md p-4 min-h-32 transition-all duration-200 hover:border-gray-600">
                      <h3 className="text-lg mb-3 text-gray-300">Poll Options</h3>
                      
                      {pollOptions.map((option, index) => (
                        <div key={index} className="flex items-center mb-3 animate-fadeIn" style={{animationDelay: ${index * 100}ms}}>
                          <input
                            type="text"
                            placeholder={Option ${index + 1}}
                            value={option}
                            onChange={(e) => updatePollOption(index, e.target.value)}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                            required={index < 2} // First two options are required
                          />
                          {index >= 2 && (
                            <button
                              type="button"
                              onClick={() => removePollOption(index)}
                              className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors duration-300 hover:rotate-90 transform"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {pollOptions.length < 6 && (
                        <button
                          type="button"
                          onClick={addPollOption}
                          className="mt-2 text-blue-400 hover:text-blue-300 transition-all duration-300 flex items-center transform hover:translate-x-1"
                        >
                          <Plus size={16} className="mr-1 transition-transform duration-300 transform group-hover:rotate-90" />
                          Add Option
                        </button>
                      )}
                      
                      <div className="mt-4">
                        <label className="block text-gray-300 mb-2">Poll Duration</label>
                        <select
                          value={pollDuration}
                          onChange={(e) => setPollDuration(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                        >
                          <option value="1 day">1 Day</option>
                          <option value="3 days">3 Days</option>
                          <option value="1 week">1 Week</option>
                          <option value="1 month">1 Month</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 transition-all duration-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-pink-800 to-orange-300 text-white rounded-md hover:from-pink-900 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 hover:shadow-glow"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-in-out forwards;
        }
        
        .hover\:shadow-glow:hover {
          box-shadow: 0 0 15px rgba(236, 72, 153, 0.5);
        }
      `}</style>
    </>
  );
}