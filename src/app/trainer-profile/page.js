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
    console.log("Review submitted:", { rating, review });
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
    console.log(`Saving ${field} with value:`, editValues[field]);
    // Implementation for saving edited field
    // For now, let's just update the local state
    if (field === 'bio') {
      setTrainer({ ...trainer, bio_line: editValues[field] });
    } else if (field === 'subjects') {
      // In a real implementation, you'd update the appropriate field
      console.log("Updated subjects");
    } else if (field === 'achievements') {
      // In a real implementation, you'd update the appropriate field
      console.log("Updated achievements");
    } else if (field === 'approach') {
      // In a real implementation, you'd update the appropriate field
      console.log("Updated teaching approach");
    } else if (field === 'education') {
      // In a real implementation, you'd update the appropriate field
      console.log("Updated education details");
    } else if (field === 'certificates') {
      // In a real implementation, you'd update the appropriate field
      console.log("Updated certificates");
    } else if (field === 'clients') {
      // In a real implementation, you'd update the appropriate field
      console.log("Updated clients");
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
    <div className="min-h-screen bg-gradient-to-r from-orange-300 to-purple-300 text-white mt-20">
      <NavBar />

      {/* Hero Banner */}
      <div className="relative h-80 flex items-center justify-center text-center">
        <Image
          src="/assets/banner.jpg"
          fill
          sizes="100%"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          alt="Trainer banner"
          priority
        />
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
            Expert Training
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-md">
            Learn from the best in the industry
          </p>
        </motion.div>
      </div>

      {/* Profile and Details */}
      <motion.div
        className="w-11/12 max-w-7xl mx-auto mt-[60px] flex flex-col lg:flex-row gap-8 p-6 z-10 relative"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Left Profile Section */}
        <motion.div
          className="lg:w-1/3 space-y-6"
          variants={fadeIn}
        >
          {/* Profile Card - with fixed positioning */}
          <div className="sticky top-6 bg-white rounded-xl shadow-xl p-8 text-center overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-orange-400 to-purple-400 rounded-t-xl"></div>

            <div className="relative mt-12">
              <div className="relative w-32 h-32 mx-auto ring-4 ring-white shadow-xl rounded-full overflow-hidden">
                <Image
                  src="/assets/images.jpeg"
                  fill
                  sizes="100%"
                  alt={`${trainer.first_name} ${trainer.last_name}`}
                  className="object-cover"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-center">
                  <h2 className="text-2xl text-gray-800 font-bold">{trainer.first_name} {trainer.last_name}</h2>
                  <ShieldCheck className="ml-2 text-amber-500 h-6 w-6" />
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {trainer.expertise_in?.map((item, index) => (
                    <span key={index} className="text-gray-700 border-2 border-orange-500 rounded-full px-3 py-1 text-sm font-medium">
                      {item.expetrise}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center mt-2 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                  <span className="ml-2 text-gray-600">4.8 (23)</span>
                </div>

                <p className="text-gray-600 mt-2 flex items-center justify-center">
                  <Award className="w-4 h-4 mr-1" />
                  {trainer.experience} years experience
                </p>
                {/* Contact Information */}
                <div className="bg-white p-6 rounded-xl shadow-lg select-none mt-6" onContextMenu={(e) => e.preventDefault()}>
                  <h3 className="font-bold text-lg text-gray-800 border-b-2 border-orange-500 pb-2 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-orange-500" />
                    Contact Information
                  </h3>
                  <div className="mt-4 space-y-3">
                    <p className="text-gray-700 flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-orange-500" />
                      <span>1234 Main Street, City, Country</span>
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-orange-500" />
                      <span>+1 234 567 890</span>
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-orange-500" />
                      <span>trainer@example.com</span>
                    </p>
                    <div className="flex space-x-6 mt-4">
                      <Facebook className="w-6 h-6 text-blue-600 cursor-pointer hover:scale-110 transition-transform" />
                      <Twitter className="w-6 h-6 text-blue-400 cursor-pointer hover:scale-110 transition-transform" />
                      <Linkedin className="w-6 h-6 text-blue-800 cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="lg:w-2/3 space-y-6"
          variants={fadeIn}
        >
          {/* Workshops Conducted */}
          <div className="bg-white rounded-xl shadow-xl p-8 text-center relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800 border-b-2 border-orange-500 pb-2 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                Workshops Conducted
              </h3>
              <button
                className="flex items-center text-orange-500 hover:text-orange-700 transition-colors"
                onClick={() => window.location.href = "/workshop"}
              >
                <Edit className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            </div>
            <div className="flex space-x-6 overflow-x-auto py-6 px-2 scrollbar-hide">
              {[
                { img: "/assets/w1.jpg", title: "Data Science Bootcamp", date: "March 2023" },
                { img: "/assets/w2.jpg", title: "Machine Learning for Beginners", date: "June 2023" },
                { img: "/assets/w3.jpg", title: "Advanced Python Programming", date: "September 2023" },
                { img: "/assets/w4.jpg", title: "Web Development Masterclass", date: "December 2023" }
              ].map((workshop, index) => (
                <div
                  key={index}
                  className="min-w-[280px] rounded-xl shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-44 w-full">
                    <img
                      src={workshop.img}
                      alt={workshop.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-semibold text-lg">{workshop.title}</p>
                      <p className="text-gray-200 text-sm">{workshop.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About Me */}
          <div className="bg-white p-6 rounded-lg shadow-md relative">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-black border-b-2 border-orange-500 pb-2">
                About Me
              </h3>
              <button
                className="flex items-center text-orange-500 hover:text-orange-700 transition-colors"
                onClick={() => handleEditClick('bio', trainer.bio_line)}
              >
                <Edit className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            </div>

            {editingField === 'bio' ? (
              <div className="mt-4">
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all resize-none"
                  placeholder="Edit your bio..."
                  rows={4}
                  value={editValues['bio'] || ''}
                  onChange={(e) => setEditValues({ ...editValues, bio: e.target.value })}
                ></textarea>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                    onClick={() => handleSaveEdit('bio')}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">{trainer.bio_line}</p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 space-y-6">
              {/* Certificates */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 border-b-2 border-orange-500 pb-2 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-orange-500" />
                    Certificates
                  </h3>
                  <button
                    className="flex items-center text-orange-500 hover:text-orange-700 transition-colors"
                    onClick={() => handleEditClick('certificates', [
                      "Certified Data Science Instructor, 2023",
                      "Machine Learning Professional, Google, 2022",
                      "Advanced Teaching Methodology, Harvard Extension, 2021",
                      "Python Programming Expert, Python Institute, 2020"
                    ].join("\n"))}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                </div>

                {editingField === 'certificates' ? (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all resize-none"
                      placeholder="Edit certificates (one per line)..."
                      rows={6}
                      value={editValues['certificates'] || ''}
                      onChange={(e) => setEditValues({ ...editValues, certificates: e.target.value })}
                    ></textarea>
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                        onClick={() => handleSaveEdit('certificates')}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <ul className="mt-4 space-y-3 text-gray-700">
                    {[
                      "Certified Data Science Instructor, 2023",
                      "Machine Learning Professional, Google, 2022",
                      "Advanced Teaching Methodology, Harvard Extension, 2021",
                      "Python Programming Expert, Python Institute, 2020"
                    ].map((certificate, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 mt-2 mr-3 bg-orange-500 rounded-full"></span>
                        <span>{certificate}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Education Details */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 border-b-2 border-orange-500 pb-2 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-orange-500" />
                    Education
                  </h3>
                  <button
                    className="flex items-center text-orange-500 hover:text-orange-700 transition-colors"
                    onClick={() => handleEditClick('education', [
                      "Ph.D. in Mathematics, Stanford University, 2018",
                      "M.Sc. in Applied Mathematics, MIT, 2015",
                      "B.Sc. in Mathematics, Harvard University, 2013"
                    ].join("\n"))}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                </div>

                {editingField === 'education' ? (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all resize-none"
                      placeholder="Edit education details (one per line)..."
                      rows={5}
                      value={editValues['education'] || ''}
                      onChange={(e) => setEditValues({ ...editValues, education: e.target.value })}
                    ></textarea>
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                        onClick={() => handleSaveEdit('education')}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <ul className="mt-4 space-y-3 text-gray-700">
                    {[
                      "Ph.D. in Mathematics, Stanford University, 2018",
                      "M.Sc. in Applied Mathematics, MIT, 2015",
                      "B.Sc. in Mathematics, Harvard University, 2013"
                    ].map((education, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 mt-2 mr-3 bg-orange-500 rounded-full"></span>
                        <span>{education}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Teaching Approach */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 border-b-2 border-orange-500 pb-2 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-orange-500" />
                    Teaching Approach
                  </h3>
                  <button
                    className="flex items-center text-orange-500 hover:text-orange-700 transition-colors"
                    onClick={() => handleEditClick('approach', "My teaching methodology combines traditional techniques with modern technology. I focus on practical applications and real-world examples to make learning relevant and engaging. Every student has unique needs, and I tailor my approach to meet individual learning styles.")}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                </div>

                {editingField === 'approach' ? (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all resize-none"
                      placeholder="Edit teaching approach..."
                      rows={6}
                      value={editValues['approach'] || ''}
                      onChange={(e) => setEditValues({ ...editValues, approach: e.target.value })}
                    ></textarea>
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                        onClick={() => handleSaveEdit('approach')}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    My teaching methodology combines traditional techniques with modern technology. I focus on practical applications and real-world examples to make learning relevant and engaging. Every student has unique needs, and I tailor my approach to meet individual learning styles.
                  </p>
                )}
              </div>
            </div>

            <div className="md:w-1/2 space-y-6">

              {/* Clients Worked With */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 border-b-2 border-orange-500 pb-2 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-orange-500" />
                    Clients Worked With
                  </h3>
                  <button
                    className="flex items-center text-orange-500 hover:text-orange-700 transition-colors"
                    onClick={() => handleEditClick('clients', "Google, Microsoft, Amazon, Meta, IBM, Stanford University, MIT, Harvard")}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                </div>

                {editingField === 'clients' ? (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all resize-none"
                      placeholder="Edit clients (comma separated)..."
                      rows={3}
                      value={editValues['clients'] || ''}
                      onChange={(e) => setEditValues({ ...editValues, clients: e.target.value })}
                    ></textarea>
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                        onClick={() => handleSaveEdit('clients')}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {["Google", "Microsoft", "Amazon", "Meta", "IBM", "Stanford University", "MIT", "Harvard"].map((client, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
                        {client}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* Analytics Section */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-lg mb-6"
                variants={fadeIn}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 border-b-2 border-orange-500 pb-2 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-orange-500" />
                    Analytics
                  </h3>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profile Views */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Profile Views</p>
                        <h4 className="text-3xl font-bold text-gray-800 mt-1">
                          {trainer.profile_views || 521}
                        </h4>
                      </div>
                      <div className="bg-orange-500/10 p-3 rounded-full">
                        <Eye className="w-8 h-8 text-orange-500" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="flex items-center text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +12%
                      </span>
                      <span className="text-gray-500 ml-2">since last month</span>
                    </div>
                  </div>

                  {/* Profile Unlocks */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Contact Unlocks</p>
                        <h4 className="text-3xl font-bold text-gray-800 mt-1">
                          {trainer.contact_unlocks || 48}
                        </h4>
                      </div>
                      <div className="bg-purple-500/10 p-3 rounded-full">
                        <Unlock className="w-8 h-8 text-purple-500" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="flex items-center text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +8%
                      </span>
                      <span className="text-gray-500 ml-2">since last month</span>
                    </div>
                  </div>
                </div>

                {/* Analytics Chart
                <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Monthly Activity</h4>
                    <select className="text-xs border rounded-md px-2 py-1 text-gray-600">
                      <option>Last 6 months</option>
                      <option>Last 12 months</option>
                      <option>All time</option>
                    </select>
                  </div>
                  <div className="h-64 w-full">
                    {/* Placeholder for chart area 
                    <div className="h-full w-full bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart2 className="w-10 h-10 text-gray-300 mx-auto" />
                        <p className="text-gray-400 text-sm mt-2">View activity trends over time</p>
                      </div>
                    </div>
                  </div>
                </div> */}
              </motion.div>
              {/* Reviews & Ratings */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800 border-b-2 border-orange-500 pb-2 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-orange-500 fill-orange-500" />
                    Reviews & Ratings
                  </h3>
                  <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span className="text-orange-800 font-bold ml-1">4.8</span>
                    <span className="text-gray-600 text-sm ml-1">(23)</span>
                  </div>
                </div>

                <div className="mt-4 space-y-4 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-gray-100">
                  {[
                    { name: "John Doe", rating: 5, comment: "Excellent teacher! The workshop was very informative and engaging. I learned so much in such a short time." },
                    { name: "Jane Smith", rating: 4, comment: "Great teaching methods, very clear explanations. The pace was a bit fast for me, but overall a fantastic learning experience." },
                    { name: "Michael Lee", rating: 5, comment: "Very engaging and knowledgeable trainer. Would definitely recommend to others looking to improve their skills." }
                  ].map((review, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-800 font-medium">{review.name}</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <div className="mt-16 py-8 bg-gradient-to-r from-orange-500 to-purple-500 text-white text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Trainer Platform. All rights reserved.</p>
      </div>
    </div>
  );
}