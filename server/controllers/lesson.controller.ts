import { Request, Response } from 'express';
import { prisma } from '../database';

const createLesson = async (req: Request, res: Response) => {
  const name = req.body.name.toLowerCase().trim();
  const { recording, subjectId } = req.body;
  console.log(req.body);
  if (name && subjectId && recording !== undefined) {
    try {
      const newLesson = await prisma.lesson.create({
        data: {
          name,
          date: new Date(),
          recording,
          subjectId
        }
      });
      res.status(201);
      res.send(newLesson);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error });
    }
  } else {
    res.status(400).send('Parameter missing to create a new lesson');
  }
};

export { createLesson };