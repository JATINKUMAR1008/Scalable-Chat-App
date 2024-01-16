import { Router } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
export const authRouter = Router();

interface ISignupBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  img_public_id: string;
  img_signature: string;
}
interface ILoginBody {
  email: string;
  password: string;
}

interface ILinkAccountBody {
  email: string;
  password: string;
}

interface IDecodedToken {
  id: string;
  iat: number;
  exp: number;
}

const prisma = new PrismaClient();

authRouter.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Auth route",
  });
});

authRouter.get("/get-data-list", async (req, res) => {
  try {
    const token: IDecodedToken = jwt.verify(
      req.headers.authorization as string,
      process.env.SECRET as string
    ) as IDecodedToken;
    if (token) {
      const data = await prisma.users.findMany({});
      const filteredData = data.filter((item) => item.id !== token.id);
      res.status(200).json({
        status: true,
        data: filteredData,
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err,
    });
  }
});

authRouter.post("/get-info", async (req, res) => {
  try {
    const { id } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
      include: {
        linkedAccounts: true,
        linkedUserLink: true,
      },
    });
    const { email, firstName, lastName, imageUrl } = user as any;
    res.status(200).json({
      status: true,
      user: {
        id: user?.id,
        email,
        firstName,
        lastName,
        imageUrl,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err,
    });
  }
});

authRouter.post("/switch-account", async (req, res) => {
  try {
    console.log(req.headers.authorization);
    const { id } = req.body;
    console.log(id);
    const token: IDecodedToken = jwt.verify(
      req.headers.authorization as string,
      process.env.SECRET as string
    ) as IDecodedToken;
    if (token) {
      console.log(token);
      const linkedUser = await prisma.users.findUnique({
        where: {
          id: req.body.id,
        },
        include: {
          linkedAccounts: true,
          linkedUserLink: true,
        },
      });
      console.log(linkedUser);
      jwt.sign(
        {
          id: linkedUser?.id,
        },
        process.env.SECRET as string,
        {
          expiresIn: "1w",
        },
        (error: Error | null, encoded: string | undefined) => {
          if (error) {
            throw new Error(error.message);
          } else {
            console.log(encoded);
            const { password, ...rest } = linkedUser as any;
            res.status(200).json({
              status: true,
              token: encoded,
              user: rest,
            });
          }
        }
      );
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err,
    });
  }
});

authRouter.post("/change-profile-picture", async (req, res) => {
  try {
    const { imageUrl, img_public_id, img_signature, email } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    await cloudinary.v2.uploader.destroy(user?.img_public_id as string);
    const updatedUser = await prisma.users.update({
      where: {
        email,
      },
      data: {
        imageUrl,
        img_public_id,
        img_signature: img_signature,
      },
    });
    res.status(200).json({
      status: true,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err,
    });
  }
});

authRouter.get("/log-user", async (req, res) => {
  try {
    console.log(req.headers.authorization);
    const token: IDecodedToken = jwt.verify(
      req.headers.authorization as string,
      process.env.SECRET as string
    ) as IDecodedToken;
    if (token) {
      const user = await prisma.users.findUnique({
        where: {
          id: token?.id,
        },
        include: {
          linkedAccounts: true,
          linkedUserLink: true,
        },
      });
      console.log(user);

      if (!user) {
        res.status(200).json({
          status: false,
          message: "User not found",
        });
      } else {
        const { password, ...rest } = user;
        res.status(200).json({
          status: true,
          user: rest,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err,
    });
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const { email, password }: ILinkAccountBody = req.body;
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (user?.password) {
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (isPasswordValid) {
        jwt.sign(
          {
            id: user.id,
          },
          process.env.SECRET as string,
          {
            expiresIn: "1w",
          },
          (error: Error | null, encoded: string | undefined) => {
            if (error) {
              throw new Error(error.message);
            } else {
              res.status(200).json({
                status: true,
                token: encoded,
              });
            }
          }
        );
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid credentials",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err,
    });
  }
});

authRouter.post("/change-profile", async (req, res) => {
  console.log(req.body);
  try {
    console.log("change profil" + req.headers.authorization);
    const token: IDecodedToken = jwt.verify(
      req.headers.authorization as string,
      process.env.SECRET as string
    ) as IDecodedToken;
    if (token) {
      const { password, id, firstName, lastName, email } = req.body;
      if (password.length > 0) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await prisma.users.update({
          where: {
            id: req.body.id,
          },
          data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
          },
        });
        console.log(user);
        res.status(200).json({
          status: true,
        });
      } else {
        const user = await prisma.users.update({
          where: {
            id: token?.id,
          },
          data: {
            firstName,
            lastName,
            email,
          },
        });
        console.log(user);
        res.status(200).json({
          status: true,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err,
    });
  }
});

authRouter.post("/link-account", async (req, res) => {
  try {
    const { email, password }: ILinkAccountBody = req.body;

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (user?.password) {
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (isPasswordValid) {
        const token: IDecodedToken = jwt.verify(
          req.headers.authorization as string,
          process.env.SECRET as string
        ) as IDecodedToken;
        if (token) {
          console.log("token id", token?.id);
          const linkedAccount = await prisma.linkedAccounts.create({
            data: {
              userId: token?.id,
              linkedUserId: user?.id,
            },
          });
          const newLinkedAccount2 = await prisma.linkedAccounts.create({
            data: {
              userId: user.id,
              linkedUserId: token?.id,
            },
          });
          res.status(200).json({
            status: true,
          });
        }
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid credentials",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err,
    });
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    const { password, ...rest }: ISignupBody = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await prisma.users.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });

    jwt.sign(
      {
        id: user.id,
      },
      process.env.SECRET as string,
      {
        expiresIn: "1w",
      },
      (error: Error | null, encoded: string | undefined) => {
        if (error) {
          throw new Error(error.message);
        } else {
          res.status(200).json({
            status: true,
            token: encoded,
          });
        }
      }
    );
  } catch (err) {
    res.status(500).json({
      status: false,
      message: (err as Error).message,
    });
  }
});
