
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { EventTask } from '@/hooks/useEventTasks';
import { taskFormSchema, TaskFormValues, getDefaultValues, TaskFormField } from './form/taskFormSchema';
import TitleField from './form/TitleField';
import DescriptionField from './form/DescriptionField';
import SelectField from './form/SelectField';
import DatePickerField from './form/DatePickerField';
import FormActions from './form/FormActions';
import { assigneeOptions, priorityOptions, categoryOptions } from './form/formOptions';

interface TaskFormProps {
  initialTask?: EventTask;
  onSave: (task: Omit<EventTask, 'id' | 'completed'>) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSave, onCancel }) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: getDefaultValues(initialTask)
  });

  const onSubmit = (values: TaskFormValues) => {
    const taskData: Omit<EventTask, 'id' | 'completed'> = {
      title: values.title,
      description: values.description,
      assignedTo: values.assignedTo,
      dueDate: values.dueDate,
      priority: values.priority,
      category: values.category
    };
    
    onSave(taskData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TitleField form={form} />
        <DescriptionField form={form} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField 
            form={form}
            name={TaskFormField.AssignedTo}
            label="Assignée à"
            options={assigneeOptions}
            placeholder="Sélectionner l'assigné"
          />

          <SelectField 
            form={form}
            name={TaskFormField.Priority}
            label="Priorité"
            options={priorityOptions}
            placeholder="Sélectionner la priorité"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField 
            form={form}
            name={TaskFormField.Category}
            label="Catégorie"
            options={categoryOptions}
            placeholder="Sélectionner la catégorie"
          />
          
          <DatePickerField form={form} />
        </div>

        <FormActions isEditMode={!!initialTask} onCancel={onCancel} />
      </form>
    </Form>
  );
};

export default TaskForm;
