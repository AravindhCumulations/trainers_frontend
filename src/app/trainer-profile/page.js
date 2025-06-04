"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Star, MapPin, Phone, Facebook, Twitter, Linkedin, Mail, Award, BookOpen, Calendar, Edit, Eye, TrendingUp, Unlock, BarChart2 } from "lucide-react";
import NavBar from "../../components/Navbar";
import Image from "next/image";

export default function TrainerDetails() {
  const [trainer, setTrainer] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit state for various fields
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await fetch(
          `http://3.94.205.118:8000/api/resource/Trainer/${window.location.search.slice(1)}`,
          {
            method: 'GET',
            headers: {
              'Authorization': 'token a6d10becfd9dfd8:e0881f66419822c',
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        setTrainer(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trainer data:', error);
        setLoading(false);
      }
    };

    fetchTrainer();
  }, []);

  const handleSubmitReview = () => {

    // Implementation for submitting review
    // Reset the form
    setRating(0);
    setReview("");
  };

  const handleEditClick = (field, value) => {
    setEditingField(field);
    setEditValues({ ...editValues, [field]: value });
  };

  const handleSaveEdit = (field) => {

    // Implementation for saving edited field
    // For now, let's just update the local state
    if (field === 'bio') {
      setTrainer({ ...trainer, bio_line: editValues[field] });
    } else if (field === 'subjects') {
      // In a real implementation, you'd update the appropriate field

    } else if (field === 'achievements') {
      // In a real implementation, you'd update the appropriate field

    } else if (field === 'approach') {
      // In a real implementation, you'd update the appropriate field

    } else if (field === 'education') {
      // In a real implementation, you'd update the appropriate field

    } else if (field === 'certificates') {
      // In a real implementation, you'd update the appropriate field

    } else if (field === 'clients') {
      // In a real implementation, you'd update the appropriate field

    }

    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-orange-300 to-purple-300">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white font-medium text-xl">Loading trainer profile...</p>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-orange-300 to-purple-300 text-white">
        <p className="text-xl font-medium">Trainer not found. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Trainer Profile</h1>
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light transition">
              Edit Profile
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-base text-gray-900">{trainer.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-base text-gray-900">{trainer.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-base text-gray-900">{trainer.phone}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                <p className="mt-1 text-base text-gray-900">{trainer.specialization}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience</label>
                <p className="mt-1 text-base text-gray-900">{trainer.experience} years</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1 text-base text-gray-900">{trainer.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}