const User = require('../models/user-model');
const LoginTracking = require('../models/login-tracking-model');

// Get logins by designation for a specific day
exports.getLoginsByDay = async (req, res) => {
    try {
        // Set up date filter - use specified date or adjust for Indian timezone
        let targetDate;

        if (req.query.date) {
            // If date is provided in the request, use it
            targetDate = new Date(req.query.date);
        } else {
            // Get current date in Indian Standard Time (UTC+5:30)
            const now = new Date();
            // Get IST date string (YYYY-MM-DD format)
            const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours and 30 minutes in milliseconds
            const istDate = new Date(now.getTime() + istOffset);
            const istDateString = istDate.toISOString().split('T')[0];
            targetDate = new Date(istDateString);
        }

        // Set start and end time for the target date (full 24 hours in IST)
        const startDate = new Date(targetDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(targetDate);
        endDate.setHours(23, 59, 59, 999);

        console.log('Target date (IST):', targetDate);
        console.log('Start date for query:', startDate);
        console.log('End date for query:', endDate);

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

        // NEW CODE: Get login counts for each user
        const userLoginCounts = await LoginTracking.aggregate([
            {
                $match: matchCondition
            },
            {
                $group: {
                    _id: "$userId",
                    loginCount: { $sum: "$loginCount" },
                    loginEvents: { $sum: 1 }
                }
            }
        ]);

        // Create a map of user IDs to login counts for easier lookup
        const userLoginMap = {};
        userLoginCounts.forEach(item => {
            userLoginMap[item._id.toString()] = {
                loginCount: item.loginCount,
                loginEvents: item.loginEvents
            };
        });

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

        // Add login counts to user data
        const enrichedUsersData = usersData.map(user => {
            const userId = user._id.toString();
            const loginInfo = userLoginMap[userId] || { loginCount: 0, loginEvents: 0 };

            return {
                ...user,
                EmpID: user.EmpID || 'N/A',
                JoiningDate: user.JoiningDate || 'N/A',
                Qualification: user.Qualification || 'N/A',
                loginCount: loginInfo.loginCount,
                loginEvents: loginInfo.loginEvents
            };
        });

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

            // Return with enriched user data
            return res.status(200).json({
                success: true,
                date: targetDate.toISOString().split('T')[0],
                totalLogins,
                totalCount,
                hourlyData: {
                    labels: hours.map(h => `${h}:00`),
                    datasets
                },
                // Replace usersData with enrichedUsersData
                usersData: enrichedUsersData
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

        // Return with enriched user data
        res.status(200).json({
            success: true,
            date: targetDate.toISOString().split('T')[0],
            totalLogins,
            totalCount,
            byDesignation: loginData,
            chartData,
            // Replace usersData with enrichedUsersData
            usersData: enrichedUsersData
        });
    } catch (error) {
        console.error('Error fetching logins by day:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
}; 