import { Task } from './kanban';

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultPriority: Task['priority'];
  defaultStatus: Task['status'];
  titleTemplate: string;
  descriptionTemplate: string;
  tags?: string[];
  estimatedDays?: number;
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  // Development Templates
  {
    id: 'bug-fix',
    name: 'Bug Fix',
    description: 'Fix a reported bug or issue',
    icon: '🐛',
    category: 'Development',
    defaultPriority: 'high',
    defaultStatus: 'todo',
    titleTemplate: 'Fix: {bug_title}',
    descriptionTemplate: `## Bug Description
{bug_description}

## Steps to Reproduce
1. {step_1}
2. {step_2}
3. {step_3}

## Expected Behavior
{expected_behavior}

## Actual Behavior
{actual_behavior}

## Additional Context
{additional_context}`,
    tags: ['bug', 'fix'],
    estimatedDays: 2,
  },
  {
    id: 'feature',
    name: 'New Feature',
    description: 'Implement a new feature or enhancement',
    icon: '✨',
    category: 'Development',
    defaultPriority: 'medium',
    defaultStatus: 'todo',
    titleTemplate: 'Feature: {feature_name}',
    descriptionTemplate: `## Feature Description
{feature_description}

## Requirements
- [ ] {requirement_1}
- [ ] {requirement_2}
- [ ] {requirement_3}

## Acceptance Criteria
- [ ] {criteria_1}
- [ ] {criteria_2}
- [ ] {criteria_3}

## Technical Notes
{technical_notes}`,
    tags: ['feature', 'enhancement'],
    estimatedDays: 5,
  },
  {
    id: 'refactor',
    name: 'Code Refactor',
    description: 'Improve existing code structure',
    icon: '🔧',
    category: 'Development',
    defaultPriority: 'low',
    defaultStatus: 'todo',
    titleTemplate: 'Refactor: {component_name}',
    descriptionTemplate: `## Refactoring Goal
{refactor_goal}

## Current Issues
- {issue_1}
- {issue_2}

## Proposed Changes
- {change_1}
- {change_2}

## Benefits
- {benefit_1}
- {benefit_2}`,
    tags: ['refactor', 'cleanup'],
    estimatedDays: 3,
  },

  // Design Templates
  {
    id: 'ui-design',
    name: 'UI Design',
    description: 'Design user interface components',
    icon: '🎨',
    category: 'Design',
    defaultPriority: 'medium',
    defaultStatus: 'todo',
    titleTemplate: 'Design: {component_name}',
    descriptionTemplate: `## Design Requirements
{design_requirements}

## User Flow
1. {flow_step_1}
2. {flow_step_2}
3. {flow_step_3}

## Design Specifications
- **Colors:** {color_scheme}
- **Typography:** {typography}
- **Spacing:** {spacing}

## Responsive Considerations
{responsive_notes}`,
    tags: ['design', 'ui'],
    estimatedDays: 2,
  },

  // Research Templates
  {
    id: 'research',
    name: 'Research Task',
    description: 'Investigate and research a topic',
    icon: '🔍',
    category: 'Research',
    defaultPriority: 'medium',
    defaultStatus: 'todo',
    titleTemplate: 'Research: {research_topic}',
    descriptionTemplate: `## Research Objective
{research_objective}

## Key Questions
- {question_1}
- {question_2}
- {question_3}

## Resources to Explore
- [ ] {resource_1}
- [ ] {resource_2}
- [ ] {resource_3}

## Expected Outcomes
{expected_outcomes}`,
    tags: ['research', 'investigation'],
    estimatedDays: 1,
  },

  // Meeting Templates
  {
    id: 'meeting',
    name: 'Meeting Preparation',
    description: 'Prepare for an upcoming meeting',
    icon: '📅',
    category: 'Planning',
    defaultPriority: 'medium',
    defaultStatus: 'todo',
    titleTemplate: 'Meeting: {meeting_topic}',
    descriptionTemplate: `## Meeting Details
- **Date:** {meeting_date}
- **Time:** {meeting_time}
- **Attendees:** {attendees}

## Agenda
1. {agenda_item_1}
2. {agenda_item_2}
3. {agenda_item_3}

## Preparation Tasks
- [ ] {prep_task_1}
- [ ] {prep_task_2}

## Questions to Ask
- {question_1}
- {question_2}`,
    tags: ['meeting', 'planning'],
    estimatedDays: 1,
  },

  // Testing Templates
  {
    id: 'testing',
    name: 'Testing Task',
    description: 'Test functionality or write tests',
    icon: '🧪',
    category: 'Quality Assurance',
    defaultPriority: 'high',
    defaultStatus: 'todo',
    titleTemplate: 'Test: {feature_name}',
    descriptionTemplate: `## Testing Scope
{testing_scope}

## Test Cases
### Happy Path
- [ ] {happy_case_1}
- [ ] {happy_case_2}

### Edge Cases
- [ ] {edge_case_1}
- [ ] {edge_case_2}

### Error Handling
- [ ] {error_case_1}
- [ ] {error_case_2}

## Test Data
{test_data}`,
    tags: ['testing', 'qa'],
    estimatedDays: 2,
  },

  // Documentation Templates
  {
    id: 'documentation',
    name: 'Documentation',
    description: 'Write or update documentation',
    icon: '📚',
    category: 'Documentation',
    defaultPriority: 'low',
    defaultStatus: 'todo',
    titleTemplate: 'Docs: {doc_topic}',
    descriptionTemplate: `## Documentation Goal
{doc_goal}

## Target Audience
{target_audience}

## Content Outline
1. {section_1}
2. {section_2}
3. {section_3}

## Key Points to Cover
- {key_point_1}
- {key_point_2}
- {key_point_3}

## Examples Needed
- {example_1}
- {example_2}`,
    tags: ['documentation', 'writing'],
    estimatedDays: 1,
  },
];

export function getTemplatesByCategory(): Record<string, TaskTemplate[]> {
  return TASK_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, TaskTemplate[]>);
}

export function applyTemplate(template: TaskTemplate, variables: Record<string, string> = {}): Partial<Task> {
  let title = template.titleTemplate;
  let description = template.descriptionTemplate;

  // Replace template variables
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    title = title.replace(new RegExp(placeholder, 'g'), value);
    description = description.replace(new RegExp(placeholder, 'g'), value);
  });

  // Calculate due date based on estimated days
  let dueDate: Date | undefined;
  if (template.estimatedDays) {
    dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + template.estimatedDays);
  }

  return {
    title,
    description,
    priority: template.defaultPriority,
    status: template.defaultStatus,
    tags: template.tags,
    dueDate,
  };
}

export function getQuickActions(): Array<{
  id: string;
  name: string;
  icon: string;
  description: string;
  action: () => Partial<Task>;
}> {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  return [
    {
      id: 'urgent-task',
      name: 'Urgent Task',
      icon: '🚨',
      description: 'High priority task due today',
      action: () => ({
        title: 'Urgent: ',
        priority: 'high' as Task['priority'],
        status: 'todo' as Task['status'],
        dueDate: today,
        tags: ['urgent'],
      }),
    },
    {
      id: 'quick-note',
      name: 'Quick Note',
      icon: '📝',
      description: 'Simple note or reminder',
      action: () => ({
        title: 'Note: ',
        priority: 'low' as Task['priority'],
        status: 'todo' as Task['status'],
        tags: ['note'],
      }),
    },
    {
      id: 'tomorrow-task',
      name: 'Tomorrow Task',
      icon: '📅',
      description: 'Task to be done tomorrow',
      action: () => ({
        title: 'Tomorrow: ',
        priority: 'medium' as Task['priority'],
        status: 'todo' as Task['status'],
        dueDate: tomorrow,
        tags: ['scheduled'],
      }),
    },
    {
      id: 'weekly-goal',
      name: 'Weekly Goal',
      icon: '🎯',
      description: 'Goal to accomplish this week',
      action: () => ({
        title: 'Weekly Goal: ',
        priority: 'medium' as Task['priority'],
        status: 'todo' as Task['status'],
        dueDate: nextWeek,
        tags: ['goal', 'weekly'],
      }),
    },
  ];
}