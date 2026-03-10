package com.myplanner.service;

import com.myplanner.model.Task;
import com.myplanner.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setPriority(taskDetails.getPriority());
            task.setStatus(taskDetails.getStatus());
            task.setCategory(taskDetails.getCategory());
            task.setDueDate(taskDetails.getDueDate());

            // Update UX Fields
            task.setTimeOfDay(taskDetails.getTimeOfDay());
            task.setAllDay(taskDetails.isAllDay());
            task.setDuration(taskDetails.getDuration());
            task.setStartTime(taskDetails.getStartTime());

            // Update Subtasks
            task.getSubTasks().clear();
            if (taskDetails.getSubTasks() != null) {
                task.getSubTasks().addAll(taskDetails.getSubTasks());
            }
            return taskRepository.save(task);
        }
        return null;
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
