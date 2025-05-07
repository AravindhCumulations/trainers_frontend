'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Edit } from 'lucide-react';
import Image from 'next/image';
import NavBar from '../nav-bar/page';

// Dummy workshops data with images
const initialWorkshops = [
  {
    id: '1',
    title: 'Fitness Fundamentals',
    description: 'Learn the basics of physical fitness and create a strong foundation for your health journey.',
    price: 99.99,
    targetAudience: 'Beginners',
    format:'virtual',
    image: '/assets/w1.jpg'
  },
  {
    id: '2',
    title: 'Advanced Nutrition Masterclass',
    description: 'Deep dive into nutrition science, meal planning, and optimal dietary strategies.',
    price: 149.99,
    targetAudience: 'Intermediate',
    format:'In-Person',
    image: '/assets/w2.jpg'
  },
  {
    id: '3',
    title: 'Mental Wellness Workshop',
    description: 'Techniques for stress management, mindfulness, and improving mental health.',
    price: 129.99,
    targetAudience: 'All Levels',
    format:'virtual',
    image: '/assets/w3.jpg'
  },
  {
    id: '4',
    title: 'High-Intensity Training Program',
    description: 'Intensive workout strategies for maximum fitness results and performance.',
    price: 199.99,
    targetAudience: 'Advanced',
    format:'In-Person',
    image: '/assets/w4.jpg'
  }
];

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState(initialWorkshops);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentWorkshop, setCurrentWorkshop] = useState({
    id: '',
    title: '',
    description: '',
    price: '',
    targetAudience: '',
    image: '',
    format: ''
  });

  const handleAddWorkshop = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!currentWorkshop.title || !currentWorkshop.description || !currentWorkshop.price || !currentWorkshop.targetAudience || !currentWorkshop.image) {
      alert('Please fill in all fields');
      return;
    }

    const workshopToAdd = {
      id: Date.now().toString(),
      title: currentWorkshop.title,
      description: currentWorkshop.description,
      price: parseFloat(currentWorkshop.price),
      targetAudience: currentWorkshop.targetAudience,
      image: currentWorkshop.image,
      format: currentWorkshop.format
    };

    setWorkshops([...workshops, workshopToAdd]);
    
    // Reset form and close modal
    setCurrentWorkshop({
      id: '',
      title: '',
      description: '',
      price: '',
      targetAudience: '',
      image: '',
      format: ''
    });
    setIsAddModalOpen(false);
  };

  const handleEditWorkshop = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!currentWorkshop.title || !currentWorkshop.description || !currentWorkshop.price || !currentWorkshop.targetAudience || !currentWorkshop.image) {
      alert('Please fill in all fields');
      return;
    }

    // Update the workshop
    setWorkshops(workshops.map(workshop => 
      workshop.id === currentWorkshop.id 
        ? {
            ...workshop,
            title: currentWorkshop.title,
            description: currentWorkshop.description,
            price: parseFloat(currentWorkshop.price),
            targetAudience: currentWorkshop.targetAudience,
            image: currentWorkshop.image,
            format: currentWorkshop.format
          }
        : workshop
    ));
    
    // Close edit modal
    setIsEditModalOpen(false);
  };

  const handleDeleteWorkshop = (id) => {
    setWorkshops(workshops.filter(workshop => workshop.id !== id));
  };

  const openEditModal = (workshop) => {
    setCurrentWorkshop({
      id: workshop.id,
      title: workshop.title,
      description: workshop.description,
      price: workshop.price.toString(),
      targetAudience: workshop.targetAudience,
      image: workshop.image,
      format: workshop.format
    });
    setIsEditModalOpen(true);
  };

  const renderWorkshopModal = (isEdit) => (
    <AnimatePresence>
      {(isEdit ? isEditModalOpen : isAddModalOpen) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-8 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{isEdit ? 'Edit Workshop' : 'Create New Workshop'}</h2>
              <button 
                onClick={() => isEdit ? setIsEditModalOpen(false) : setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>

            <form onSubmit={isEdit ? handleEditWorkshop : handleAddWorkshop} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Workshop Title</label>
                <input 
                  type="text"
                  value={currentWorkshop.title}
                  onChange={(e) => setCurrentWorkshop({...currentWorkshop, title: e.target.value})}
                  placeholder="Enter workshop title"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea 
                  value={currentWorkshop.description}
                  onChange={(e) => setCurrentWorkshop({...currentWorkshop, description: e.target.value})}
                  placeholder="Describe your workshop"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Price</label>
                <input 
                  type="number"
                  value={currentWorkshop.price}
                  onChange={(e) => setCurrentWorkshop({...currentWorkshop, price: e.target.value})}
                  placeholder="Enter workshop price"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Target Audience</label>
                <select
                  value={currentWorkshop.targetAudience}
                  onChange={(e) => setCurrentWorkshop({...currentWorkshop, targetAudience: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Target Audience</option>
                  <option value="Beginners">Beginners</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Format</label>
                <select
                  value={currentWorkshop.format}
                  onChange={(e) => setCurrentWorkshop({...currentWorkshop, format: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Format</option>
                  <option value="virtual">Virtual</option>
                  <option value="In-Person">In-Person</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Image URL</label>
                <input 
                  type="text"
                  value={currentWorkshop.image}
                  onChange={(e) => setCurrentWorkshop({...currentWorkshop, image: e.target.value})}
                  placeholder="Enter image URL"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              >
                {isEdit ? 'Update Workshop' : 'Create Workshop'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-200 to-purple-200 p-8">
      <NavBar/>
      <div className="container mx-auto mt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Workshops</h1>
          <button 
            onClick={() => {
              // Reset current workshop and open add modal
              setCurrentWorkshop({
                id: '',
                title: '',
                description: '',
                price: '',
                targetAudience: '',
                image: '',
                format: ''
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            <Plus className="mr-2" /> Add Workshop
          </button>
        </div>

        {workshops.length === 0 ? (
          <div className="text-center text-gray-600 mt-16">
            <p className="text-2xl">No workshops added yet</p>
            <p className="text-lg mt-2">Click "Add Workshop" to get started</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => (
              <motion.div 
                key={workshop.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-48 w-full">
                  <Image 
                    src={workshop.image} 
                    alt={workshop.title}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button 
                      onClick={() => openEditModal(workshop)}
                      className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition"
                    >
                      <Edit />
                    </button>
                    <button 
                      onClick={() => handleDeleteWorkshop(workshop.id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">{workshop.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{workshop.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-bold">${workshop.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {workshop.targetAudience}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {workshop.format}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Workshop Creation Modal */}
        {renderWorkshopModal(false)}
        
        {/* Workshop Edit Modal */}
        {renderWorkshopModal(true)}
      </div>
      <div className="mt-16 py-8 bg-gradient-to-r from-orange-500 to-purple-500 text-white text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Trainer Platform. All rights reserved.</p>
      </div>
    </div>
  );
}