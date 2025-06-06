const AuthLogin = require("../../auth/login/model");
const Programs = require("../../admin/programs/model");

const DashboardAdminController = {
  // Get counts of all user roles, separated by archived and non-archived status
  getUserCounts: async (req, res) => {
    try {
      // Fetch non-archived counts (isArchived: false)
      const adminCount = await AuthLogin.countDocuments({ isArchived: false, role: "admin" });
      const admissionCount = await AuthLogin.countDocuments({ isArchived: false, role: "admission" });
      const applicantCount = await AuthLogin.countDocuments({ isArchived: false, role: "applicant" });
      const studentCount = await AuthLogin.countDocuments({ isArchived: false, role: "student" });
      const facultyCount = await AuthLogin.countDocuments({ isArchived: false, role: "faculty" });
      const registrarCount = await AuthLogin.countDocuments({ isArchived: false, role: "registrar" });

      // Fetch archived counts (isArchived: true)
      const adminArchiveCount = await AuthLogin.countDocuments({ isArchived: true, role: "admin" });
      const admissionArchiveCount = await AuthLogin.countDocuments({ isArchived: true, role: "admission" });
      const applicantArchiveCount = await AuthLogin.countDocuments({ isArchived: true, role: "applicant" });
      const studentArchiveCount = await AuthLogin.countDocuments({ isArchived: true, role: "student" });
      const facultyArchiveCount = await AuthLogin.countDocuments({ isArchived: true, role: "faculty" });
      const registrarArchiveCount = await AuthLogin.countDocuments({ isArchived: true, role: "registrar" });

      // Fetch program count (unchanged)
      const programCount = await Programs.countDocuments();

      // Return the counts in a single response
      res.status(200).json({
        admins: adminCount,
        adminArchived: adminArchiveCount,
        admissions: admissionCount,
        admissionArchived: admissionArchiveCount,
        applicants: applicantCount,
        applicantArchived: applicantArchiveCount,
        students: studentCount,
        studentArchived: studentArchiveCount,
        faculty: facultyCount,
        facultyArchived: facultyArchiveCount,
        registrars: registrarCount,
        registrarArchived: registrarArchiveCount,
        programs: programCount
      });
    } catch (error) {
      res.status(400).json({ message: "Error fetching user counts", error: error.message });
    }
  },

  getLandingCounts: async (req, res) => {
    try {
      // Count students
      const studentCount = await AuthLogin.countDocuments({ role: "student" });

      // Aggregate unique staff by full name
      const staffAggregation = await AuthLogin.aggregate([
        {
          $match: {
            role: { $in: ["admin", "admission", "faculty", "registrar"] }
          }
        },
        {
          $addFields: {
            fullName: {
              $concat: [
                { $ifNull: ["$name.firstname", ""] },
                " ",
                { $ifNull: ["$name.middlename", ""] },
                " ",
                { $ifNull: ["$name.lastname", ""] },
                " ",
                { $ifNull: ["$name.extension", ""] }
              ]
            }
          }
        },
        {
          $group: {
            _id: "$fullName"
          }
        },
        {
          $count: "total"
        }
      ]);

      const staffCount = staffAggregation[0]?.total || 0;

      // Count programs
      const programCount = await Programs.countDocuments();

      // Respond
      res.status(200).json({
        programs: programCount,
        students: studentCount,
        staffs: staffCount,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error fetching landing counts",
        error: error.message
      });
    }
  }
};

module.exports = DashboardAdminController;