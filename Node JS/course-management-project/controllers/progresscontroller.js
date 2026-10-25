const Progress = require('../models/progress');
const Assignment = require('../models/assignment');
const Submission=require('../models/submission')
const Student = require('../models/studentmodel')
const Course=require('../models/course')
const User = require('../models/usermodel'); // Assuming your user model is named 'usermodel'

// Create a new progress (Admin only)
const createProgress = async (req, res) => {
    const { progresses, assignment } = req.body;
    const { id } = req.params;

    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User information is missing' });
        }

        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Check if the assignment exists
        const existingAssignment = await Assignment.findById(assignment);
        if (!existingAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Create the new progress
        const newProgress = new Progress({
            progresses,
            assignment,
        });

        const savedProgress = await newProgress.save();

        res.status(201).json({ message: 'Progress created successfully', progress: savedProgress });
    } catch (error) {
        console.error('Error creating progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all progress records
const getAllProgress = async (req, res) => {
    try {
        const progress = await Progress.find().populate('assignment');
        res.status(200).json(progress);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a specific progress record by ID
const getProgressById = async (req, res) => {
    const { id } = req.params;

    try {
        const progress = await Progress.findById(id).populate('assignment');
        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }
        res.status(200).json(progress);
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a progress record (Admin only)
const updateProgress = async (req, res) => {
    const { id } = req.params;
    const { progresses, assignment } = req.body;

    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User information is missing' });
        }

        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Update the progress record
        const updatedProgress = await Progress.findByIdAndUpdate(
            id,
            { progresses, assignment },
            { new: true }
        );

        if (!updatedProgress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        res.status(200).json({ message: 'Progress updated successfully', progress: updatedProgress });
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a progress record (Admin only)
const deleteProgress = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User information is missing' });
        }

        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role required for this action!' });
        }

        // Delete the progress record
        const deletedProgress = await Progress.findByIdAndDelete(id);

        if (!deletedProgress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        res.status(200).json({ message: 'Progress deleted successfully' });
    } catch (error) {
        console.error('Error deleting progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update completed status
const completeStatus = async (req, res) => {
    const { courseid } = req.params;  // Get the course ID from the route parameters
    const studentId = req.user.id;    // Get the student ID from the authenticated user

    try {
        // Use the countAssignmentsMiddleware to get the counts
        if (!req.assignmentCounts){
            return res.status(400).json({message:"Count is not calculated"})
        }
        const { pendingCount, completedCount, totalCount } = req.assignmentCounts;

        // Check if all assignments are completed
        if (completedCount === totalCount && totalCount > 0) {
            // Find the student and course documents
            const student = await Student.findOne({userDetails:studentId});
            const course = await Course.findById(courseid);

            if (!student || !course) {
                return res.status(404).json({ message: 'Student or Course not found' });
            }

            // Ensure completedCourses is initialized as an array
            if (!Array.isArray(student.completedCourses)) {
                student.completedCourses = [];
            }

            // Ensure completedStudents is initialized as an array
            if (!Array.isArray(course.completedStudents)) {
                course.completedStudents = [];
            }

            // Update the student's completed courses if not already added
            if (!student.completedCourses.includes(courseid)) {
                student.completedCourses.push(courseid);
                await student.save();
            }
            else{
                return res.status(400).json({ message: 'Course already completed by the user' });
            }

            // Update the course's completed students if not already added
            if (!course.completedStudents.includes(studentId)) {
                course.completedStudents.push(studentId);
                await course.save();
            }
            else{
                return res.status(400).json({ message: 'Course already completed by the user' });
            }

            return res.status(200).json({ message: 'Course marked as completed for the student' });
        } else {
            return res.status(400).json({ message: 'Course is not yet fully completed' });
        }
    } catch (error) {
        console.error('Error updating course completion status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};



module.exports = { createProgress, getAllProgress, getProgressById, updateProgress, deleteProgress,completeStatus };
