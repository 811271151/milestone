import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

import { ProjectDetail } from '@/features/projects/ProjectDetail';
import { projects } from '@/domain/mockData';

export default function ProjectDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const project = projects.find((item) => item.id === id);
  return project ? <ProjectDetail project={project} /> : <Text>Project not found</Text>;
}
