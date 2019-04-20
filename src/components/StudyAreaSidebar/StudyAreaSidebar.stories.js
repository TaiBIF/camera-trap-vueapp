import { storiesOf } from '@storybook/vue';
import StoryRouter from 'storybook-vue-router';
import StudyAreaSidebar from './StudyAreaSidebar.vue';

storiesOf('StudyAreaSidebar', module)
  .addDecorator(StoryRouter())
  .add('ch2.4 & ch4', () => ({
    components: { StudyAreaSidebar },
    data() {
      return {
        studyAreas: [
          {
            id: 'a',
            title: '母樣區',
            children: [
              { id: 'a1', title: '子樣區' },
              {
                id: 'a2',
                title: '樣區 with error',
                hasError: true,
              },
              { id: 'a3', title: '樣區 lock', locked: true },
            ],
          },
          {
            id: 'b',
            title: '樣區 wo children',
            children: [],
          },
        ],
        projectId: 'projectId',
      };
    },
    template: `
      <div style="width: 300px">
        <study-area-sidebar :studyAreas="studyAreas" :projectId="projectId" currentStudyAreaId="a1" />
      </div>
    `,
  }));
