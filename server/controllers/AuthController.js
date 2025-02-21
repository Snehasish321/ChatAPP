import getPrismaInstance from "../utils/PrismaClient.js";


export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({msg: "Email is required ." , status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } }); 
    if (!user) {
      return res.json({ msg: "User not found.", status: false });
    }
    else {
      return res.json({ msg: "User Found.", status: true , data: user }); 
    }
  } catch (err) {
    next(err);
  }
};

export const onboardUser = async (req, res, next) => {
  try {
    const {email,name,about,image:profilePicture} = req.body;
    if(!email || !name || !profilePicture) {
      return res.json(  "All fields are required." );
  
  }
  const prisma = getPrismaInstance();
  const user = await prisma.user.create({
    data: {email,name,about,profilePicture},
  });
  return res.json({msg: "User onboarded successfully.", status: true , user});
} catch (err) {
    next(err)
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      orderBy: {name: "asc" },
      select: {
        id: true,
        email: true,
        name : true,
        profilePicture: true,
        about: true,
      },
    });
    const usersGroupedByInitialLetter = {}; 
    users.forEach((user) => {
      const initialLetter = user.name.charAt(0).toUpperCase();
      if (!usersGroupedByInitialLetter[initialLetter]) {
        usersGroupedByInitialLetter[initialLetter] = [];
      }
      usersGroupedByInitialLetter[initialLetter].push(user);
    });
    return res.status(200).send ({ users: usersGroupedByInitialLetter });
  } catch (err) {
    next(err);
  }
};