import { Request, Response } from 'express';
import { prisma } from '../database';

const createLesson = async (req: Request, res: Response) => {
  const name = req.body.name.toLowerCase().trim();
  const { subjectId, scheduledDate } = req.body;
  console.log(req.body);
  if (name && subjectId && scheduledDate) {
    try {
      const newLesson = await prisma.lesson.create({
        data: {
          name,
          subjectId,
          scheduledDate,
        },
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

const getLesson = async (req: Request, res: Response) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: req.params.lessonId,
    },
  });
  res.status(200).send(lesson);
};

const deleteLesson = async (req: Request, res: Response) => {
  const lessonId = req.params.lessonId;
  try {
    const libraries = await prisma.library.findMany({
      where: {
        lessons: {
          some: {
            id: lessonId,
          },
        },
      },
    });
    await Promise.all(
      libraries.map(async (library) => {
        await prisma.library.update({
          where: {
            id: library.id,
          },
          data: {
            lessons: {
              disconnect: {
                id: lessonId,
              },
            },
          },
        });
      })
    );
  
    await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { notes: true },
    });
    await prisma.whiteboard.deleteMany({
      where: {
        lessonId: lessonId,
      },
    });
    const deletedLesson = await prisma.lesson.delete({
      where: {
        id: lessonId,
      },
    });
    res.status(200).send(deletedLesson);
  } catch (error) {
    console.error(error);
    res.status(500).send('Lesson not found');
  }
};

const updateLesson = async (req: Request, res: Response) => {
  console.log(req.body);
  const updatedLesson = await prisma.lesson.updateMany({
    where: {
      id: req.params.lessonId,
    },
    data: {
      video: req.body.video,
      drawing: req.body.drawing,
    },
  });
  res.status(201).send(updatedLesson);
};

export { createLesson, deleteLesson, getLesson, updateLesson };
