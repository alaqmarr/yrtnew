import { userService } from "../../modules/users/service/user.service";

async function seedStaff() {
  console.log("Seeding sample staff accounts...");

  const sampleStaff = [
    {
      name: "Karthik Subramanian",
      email: "karthik.chennai@yellowribbontravels.com",
      password: "Password123!",
      role: "staff" as const,
      phone: "+91 98401 54321",
      department: "Tour Operations & Branch Sales",
      branch_id: "br_chennai",
      is_active: true,
    },
    {
      name: "Pooja Kulkarni",
      email: "pooja.pune@yellowribbontravels.com",
      password: "Password123!",
      role: "staff" as const,
      phone: "+91 97654 32190",
      department: "Visa & Custom Packages",
      branch_id: "br_pune",
      is_active: true,
    },
  ];

  for (const s of sampleStaff) {
    try {
      const created = await userService.createUser(s);
      console.log(`Created staff: ${created.name} (${created.email})`);
    } catch (e) {
      console.log(`Staff ${s.email} already exists or error:`, (e as Error).message);
    }
  }

  const all = await userService.getAllUsers();
  console.log("Current total users:", all.length);
  for (const u of all) {
    console.log(`- [${u.role.toUpperCase()}] ${u.name} <${u.email}> (Dept: ${u.department || 'N/A'}, Branch: ${u.branch_city || 'N/A'}, Active: ${u.is_active})`);
  }
}

seedStaff()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
