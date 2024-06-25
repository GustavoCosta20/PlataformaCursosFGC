// __tests__/likeService.test.ts
import { likeService } from "../src/services/likeService";
import { Like } from "../src/models";

// Mocking the Like model
jest.mock("../src/models", () => ({
  Like: {
    create: jest.fn(),
    destroy: jest.fn(),
    findOne: jest.fn(),
  },
}));

describe("likeService", () => {
  const userId = 1;
  const courseId = 101;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("create should call Like.create with correct parameters", async () => {
    const likeData = { userId, courseId };
    (Like.create as jest.Mock).mockResolvedValue(likeData);

    const result = await likeService.create(userId, courseId);

    expect(Like.create).toHaveBeenCalledWith({
      userId,
      courseId,
    });
    expect(result).toEqual(likeData);
  });

  test("delete should call Like.destroy with correct parameters", async () => {
    await likeService.delete(userId, courseId);

    expect(Like.destroy).toHaveBeenCalledWith({
      where: { userId, courseId },
    });
  });

  test("isLiked should return true if Like.findOne finds a like", async () => {
    (Like.findOne as jest.Mock).mockResolvedValue({ userId, courseId });

    const result = await likeService.isLiked(userId, courseId);

    expect(Like.findOne).toHaveBeenCalledWith({
      where: { userId, courseId },
    });
    expect(result).toBe(true);
  });

  test("isLiked should return false if Like.findOne does not find a like", async () => {
    (Like.findOne as jest.Mock).mockResolvedValue(null);

    const result = await likeService.isLiked(userId, courseId);

    expect(Like.findOne).toHaveBeenCalledWith({
      where: { userId, courseId },
    });
    expect(result).toBe(false);
  });
});
