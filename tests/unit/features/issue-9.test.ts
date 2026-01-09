// src/features/issue-9.test.ts

import { analyzeService, defineRequirements, prioritizeTasks } from './issue-9';
import * as externalDependencies from '../utils/externalDependencies';

jest.mock('../utils/externalDependencies');

describe('Issue 9: Service Analysis and Requirements Definition', () => {
  describe('analyzeService', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should analyze service successfully', async () => {
      const mockAnalysis = {
        features: ['feature1', 'feature2'],
        techStack: ['tech1', 'tech2'],
        feedback: ['feedback1', 'feedback2'],
        competitors: ['competitor1', 'competitor2']
      };
      (externalDependencies.fetchServiceData as jest.Mock).mockResolvedValue(mockAnalysis);

      const result = await analyzeService();

      expect(result).toEqual(mockAnalysis);
      expect(externalDependencies.fetchServiceData).toHaveBeenCalledTimes(1);
    });

    it('should handle empty analysis data', async () => {
      (externalDependencies.fetchServiceData as jest.Mock).mockResolvedValue({});

      const result = await analyzeService();

      expect(result).toEqual({});
    });

    it('should throw an error when fetchServiceData fails', async () => {
      (externalDependencies.fetchServiceData as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(analyzeService()).rejects.toThrow('Failed to analyze service: API Error');
    });
  });

  describe('defineRequirements', () => {
    it('should define requirements successfully', () => {
      const mockAnalysis = {
        features: ['feature1', 'feature2'],
        techStack: ['tech1', 'tech2'],
        feedback: ['feedback1', 'feedback2'],
        competitors: ['competitor1', 'competitor2']
      };

      const result = defineRequirements(mockAnalysis);

      expect(result).toHaveProperty('business');
      expect(result).toHaveProperty('functional');
      expect(result).toHaveProperty('nonFunctional');
      expect(result).toHaveProperty('userStories');
    });

    it('should handle empty analysis input', () => {
      const result = defineRequirements({});

      expect(result).toEqual({
        business: [],
        functional: [],
        nonFunctional: [],
        userStories: []
      });
    });

    it('should generate user stories based on features', () => {
      const mockAnalysis = {
        features: ['Ride booking', 'Driver rating']
      };

      const result = defineRequirements(mockAnalysis);

      expect(result.userStories).toContain('As a user, I want to book a ride');
      expect(result.userStories).toContain('As a user, I want to rate my driver');
    });
  });

  describe('prioritizeTasks', () => {
    it('should prioritize tasks successfully', () => {
      const mockRequirements = {
        business: ['business1', 'business2'],
        functional: ['functional1', 'functional2'],
        nonFunctional: ['nonFunctional1', 'nonFunctional2'],
        userStories: ['story1', 'story2']
      };

      const result = prioritizeTasks(mockRequirements);

      expect(result).toHaveProperty('mvp');
      expect(result).toHaveProperty('priorities');
      expect(result).toHaveProperty('milestones');
    });

    it('should handle empty requirements input', () => {
      const result = prioritizeTasks({
        business: [],
        functional: [],
        nonFunctional: [],
        userStories: []
      });

      expect(result).toEqual({
        mvp: [],
        priorities: [],
        milestones: []
      });
    });

    it('should select MVP features', () => {
      const mockRequirements = {
        business: ['Critical feature'],
        functional: ['Basic functionality'],
        nonFunctional: ['Performance requirement'],
        userStories: ['Essential user story']
      };

      const result = prioritizeTasks(mockRequirements);

      expect(result.mvp).toContain('Critical feature');
      expect(result.mvp).toContain('Basic functionality');
    });

    it('should create milestones', () => {
      const mockRequirements = {
        business: ['business1', 'business2'],
        functional: ['functional1', 'functional2'],
        nonFunctional: ['nonFunctional1', 'nonFunctional2'],
        userStories: ['story1', 'story2']
      };

      const result = prioritizeTasks(mockRequirements);

      expect(result.milestones.length).toBeGreaterThan(0);
      expect(result.milestones[0]).toHaveProperty('name');
      expect(result.milestones[0]).toHaveProperty('tasks');
    });
  });
});