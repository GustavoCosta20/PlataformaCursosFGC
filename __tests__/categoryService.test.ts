// __tests__/categoryService.test.ts
import { categoryService } from "../src/services/categoryService";
import { Category } from "../src/models";

// Mocking the Category model
jest.mock("../src/models", () => ({
  Category: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe("categoryService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findAllPaginated", () => {
    const page = 1;
    const perPage = 10;

    test("should return paginated categories", async () => {
      const mockCategories = {
        count: 20,
        rows: [
          { id: 1, name: "Category 1", position: 1 },
          { id: 2, name: "Category 2", position: 2 },
        ],
      };

      (Category.findAndCountAll as jest.Mock).mockResolvedValue(mockCategories);

      const result = await categoryService.findAllPaginated(page, perPage);

      expect(Category.findAndCountAll).toHaveBeenCalledWith({
        attributes: ["id", "name", "position"],
        order: [["position", "ASC"]],
        limit: perPage,
        offset: 0,
      });

      expect(result).toEqual({
        categories: mockCategories.rows,
        page: page,
        perPage: perPage,
        total: mockCategories.count,
      });
    });
  });

  describe("findByIdWithCourses", () => {
    const id = "1";

    test("should return category with courses", async () => {
      const mockCategoryWithCourses = {
        id: 1,
        name: "Category 1",
        courses: [
          {
            id: 1,
            name: "Course 1",
            synopsis: "Synopsis 1",
            thumbnailUrl: "http://example.com/thumbnail1.jpg",
          },
          {
            id: 2,
            name: "Course 2",
            synopsis: "Synopsis 2",
            thumbnailUrl: "http://example.com/thumbnail2.jpg",
          },
        ],
      };

      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategoryWithCourses);

      const result = await categoryService.findByIdWithCourses(id);

      expect(Category.findByPk).toHaveBeenCalledWith(id, {
        attributes: ["id", "name"],
        include: {
          association: "courses",
          attributes: ["id", "name", "synopsis", ["thumbnail_url", "thumbnailUrl"]],
        },
      });

      expect(result).toEqual(mockCategoryWithCourses);
    });

    test("should return null if category not found", async () => {
      (Category.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await categoryService.findByIdWithCourses(id);

      expect(Category.findByPk).toHaveBeenCalledWith(id, {
        attributes: ["id", "name"],
        include: {
          association: "courses",
          attributes: ["id", "name", "synopsis", ["thumbnail_url", "thumbnailUrl"]],
        },
      });

      expect(result).toBeNull();
    });
  });
});
