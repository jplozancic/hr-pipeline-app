import { describe, it, expect } from "vitest";
import { filterCandidates, sortCandidates } from "./filterHelpers";
import type { CandidateListItem } from "../types";
import type { CandidateStatus } from "@/core/types";

const mockCandidates: CandidateListItem[] = [
  {
    id: "c1",
    name: "Alice Johnson",
    email: "alice@example.com",
    position: "Frontend Developer",
    seniority: "Junior",
    status: "New" as CandidateStatus,
    lastActivityAt: "2023-01-10T10:00:00Z",
    score: 85,
    summary: "Mock summary",
    recruiterId: "r1",
    recruiter: { id: "r1", name: "Recruiter 1", email: "r1@test.com" },
    tagIds: [],
    tags: [],
    skillIds: [],
    expectedSalary: undefined,
    expectedSalaryCurrency: undefined,
    rejectionReason: undefined
  },
  {
    id: "c2",
    name: "Bob Smith",
    email: "bob@test.com",
    position: "Backend Developer",
    seniority: "Senior",
    status: "Interview" as CandidateStatus,
    lastActivityAt: "2023-01-15T10:00:00Z",
    score: 95,
    summary: "Mock summary 2",
    recruiterId: "r2",
    recruiter: { id: "r2", name: "Recruiter 2", email: "r2@test.com" },
    tagIds: [],
    tags: [],
    skillIds: [],
    expectedSalary: undefined,
    expectedSalaryCurrency: undefined,
    rejectionReason: undefined
  },
];

/**
 * Tests for the `filterCandidates` utility.
 * Assesses whether search string and exact enum dropdown filtering interact correctly.
 */
describe("filterCandidates", () => {
  it("should return all when filters are empty/'all'", () => {
    const result = filterCandidates(mockCandidates, {
      search: "",
      status: "all",
      seniority: "all",
      recruiterId: "all",
    });
    expect(result.length).toBe(2);
  });

  it("should filter by search (name)", () => {
    const result = filterCandidates(mockCandidates, {
      search: "alice",
      status: "all",
      seniority: "all",
      recruiterId: "all",
    });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Alice Johnson");
  });

  it("should filter by search (email)", () => {
    const result = filterCandidates(mockCandidates, {
      search: "bob@test",
      status: "all",
      seniority: "all",
      recruiterId: "all",
    });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Bob Smith");
  });

  it("should filter by status exactly", () => {
    const result = filterCandidates(mockCandidates, {
      search: "",
      status: "Interview",
      seniority: "all",
      recruiterId: "all",
    });
    expect(result.length).toBe(1);
    expect(result[0].status).toBe("Interview");
  });
  
  it("should filter by multiple criteria", () => {
    const result = filterCandidates(mockCandidates, {
      search: "",
      status: "Interview",
      seniority: "Senior",
      recruiterId: "r2",
    });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Bob Smith");
  });
});

/**
 * Tests for the `sortCandidates` utility.
 * Verifies that nested dates and numeric scores can be ordered bidirectionally.
 */
describe("sortCandidates", () => {
  it("should sort by score descending", () => {
    const result = sortCandidates(mockCandidates, "score", "desc");
    expect(result[0].score).toBe(95);
    expect(result[1].score).toBe(85);
  });

  it("should sort by score ascending", () => {
    const result = sortCandidates(mockCandidates, "score", "asc");
    expect(result[0].score).toBe(85);
    expect(result[1].score).toBe(95);
  });

  it("should sort by lastActivityAt descending", () => {
    const result = sortCandidates(mockCandidates, "lastActivityAt", "desc");
    expect(result[0].name).toBe("Bob Smith"); // 15th
    expect(result[1].name).toBe("Alice Johnson"); // 10th
  });
});
