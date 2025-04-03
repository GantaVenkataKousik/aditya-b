const User = require('../models/user-model');
const LoginTracking = require('../models/login-tracking-model');

// Get logins by designation for a specific day
exports.getLoginsByDay = async (req, res) => {
    try {
        // Set up date filter - use specified date or default to today
        const targetDate = req.query.date ? new Date(req.query.date) : new Date();

        // Set start and end time for the target date (full 24 hours)
        const startDate = new Date(targetDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(targetDate);
        endDate.setHours(23, 59, 59, 999);

        // Build match condition
        const matchCondition = {
            date: {
                $gte: startDate,
                $lte: endDate
            }
        };

        // Add designation filter if provided
        if (req.query.designation) {
            matchCondition.designation = req.query.designation;
        }

        // NEW CODE: Fetch unique user IDs from login tracking for this time period
        const uniqueUserIds = await LoginTracking.distinct("userId", matchCondition);

        // NEW CODE: Fetch user details for these users
        const usersData = await User.find(
            { _id: { $in: uniqueUserIds } },
            {
                fullName: 1,
                email: 1,
                EmpID: 1,
                designation: 1,
                department: 1,
                JoiningDate: 1,
                Qualification: 1,
                UG: 1,
                PG: 1,
                Phd: 1
            }
        ).lean();

        // Check if hourly breakdown is requested
        if (req.query.hourly === 'true') {
            // Aggregate logins by hour and designation
            const hourlyData = await LoginTracking.aggregate([
                {
                    $match: matchCondition
                },
                {
                    $addFields: {
                        hour: { $hour: "$date" }  // Extract hour from date
                    }
                },
                {
                    $group: {
                        _id: {
                            hour: "$hour",
                            designation: "$designation"
                        },
                        count: { $sum: 1 },
                        totalLogins: { $sum: "$loginCount" }
                    }
                },
                {
                    $sort: { "_id.hour": 1, "_id.designation": 1 }
                }
            ]);

            // Format data for chart rendering
            const hours = Array.from({ length: 24 }, (_, i) => i);
            const designations = [...new Set(hourlyData.map(item => item._id.designation))];

            // Create datasets object
            const datasets = {};

            // Initialize with zeros
            designations.forEach(designation => {
                datasets[designation] = new Array(24).fill(0);
            });

            // Fill in actual data
            hourlyData.forEach(item => {
                const { hour, designation } = item._id;
                datasets[designation][hour] = item.totalLogins;
            });

            // Get totals
            const totalLogins = hourlyData.reduce((sum, item) => sum + item.totalLogins, 0);
            const totalCount = hourlyData.reduce((sum, item) => sum + item.count, 0);

            // NEW CODE: Add users data to the response
            return res.status(200).json({
                success: true,
                date: targetDate.toISOString().split('T')[0],
                totalLogins,
                totalCount,
                hourlyData: {
                    labels: hours.map(h => `${h}:00`),
                    datasets
                },
                // Add the users data here
                usersData: usersData.map(user => ({
                    ...user,
                    EmpID: user.EmpID || 'N/A',
                    JoiningDate: user.JoiningDate || 'N/A',
                    Qualification: user.Qualification || 'N/A'
                }))
            });
        }

        // Original code for designation-based grouping
        const loginData = await LoginTracking.aggregate([
            {
                $match: matchCondition
            },
            {
                $group: {
                    _id: "$designation",
                    count: { $sum: 1 },
                    totalLogins: { $sum: "$loginCount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    designation: "$_id",
                    count: 1,
                    totalLogins: 1
                }
            },
            {
                $sort: { designation: 1 }
            }
        ]);

        // Get total across all designations
        const totalLogins = loginData.reduce((sum, item) => sum + item.totalLogins, 0);
        const totalCount = loginData.reduce((sum, item) => sum + item.count, 0);

        // Format data for chart rendering
        const chartData = {
            labels: loginData.map(item => item.designation),
            datasets: {
                counts: loginData.map(item => item.count),
                logins: loginData.map(item => item.totalLogins)
            }
        };

        // NEW CODE: Add users data to the response
        res.status(200).json({
            success: true,
            date: targetDate.toISOString().split('T')[0],
            totalLogins,
            totalCount,
            byDesignation: loginData,
            chartData,
            // Add the users data here
            usersData: usersData.map(user => ({
                ...user,
                EmpID: user.EmpID || 'N/A',
                JoiningDate: user.JoiningDate || 'N/A',
                Qualification: user.Qualification || 'N/A'
            }))
        });
    } catch (error) {
        console.error('Error fetching logins by day:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
}; 