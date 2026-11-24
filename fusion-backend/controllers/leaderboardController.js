import Submission from "../models/Submission.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaders = await Submission.aggregate([
      {
        $group: {
          _id: "$userId",

          totalSubmissions: {
            $sum: 1,
          },

          accepted: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Accepted"] },
                1,
                0,
              ],
            },
          },

          totalMarks: {
            $sum: { $ifNull: ["$totalMarks", 0] },
          },

          lastSubmission: {
            $max: "$createdAt",
          },
        },
      },

      {
        $addFields: {
          accuracy: {
            $cond: [
              { $gt: ["$totalSubmissions", 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$accepted", "$totalSubmissions"] },
                      100,
                    ],
                  },
                  2,
                ],
              },
              0,
            ],
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "student",
        },
      },

      {
        $unwind: {
          path: "$student",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          userId: "$_id",
          _id: 0,
          name: {
            $ifNull: ["$student.name", "Student"],
          },
          rollNumber: {
            $ifNull: ["$student.rollNumber", "N/A"],
          },
          totalSubmissions: 1,
          accepted: 1,
          totalMarks: 1,
          accuracy: 1,
          lastSubmission: 1,
        },
      },

      {
        $sort: {
          accepted: -1,
          totalMarks: -1,
          accuracy: -1,
        },
      },
    ]);

    const rankedLeaders = leaders.map((leader, index) => ({
      rank: index + 1,
      ...leader,
    }));

    return res.json({
      success: true,
      leaders: rankedLeaders,
    });
  } catch (err) {
    console.error("LEADERBOARD ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Could not load leaderboard.",
    });
  }
};