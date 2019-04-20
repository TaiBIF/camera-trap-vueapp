import { action } from '@storybook/addon-actions';
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
        currentStudyAreaId: null,
      };
    },
    methods: {
      selectStudyArea(id) {
        this.currentStudyAreaId = id;
      },
    },
    template: `
      <div style="width: 300px">
        <study-area-sidebar
          :studyAreas="studyAreas"
          :projectId="projectId"
          :currentStudyAreaId="currentStudyAreaId"
          @selectArea="selectStudyArea"
        />
      </div>
    `,
  }))
  .add('ch3.4', () => ({
    components: { StudyAreaSidebar },
    data() {
      return {
        studyAreas: [
          {
            id: 'a',
            title: '母樣區',
            children: [{ id: 'a1', title: '子樣區' }],
          },
          {
            id: 'b',
            title: '樣區 wo children',
            children: [],
          },
        ],
        projectId: 'projectId',
        currentStudyAreaId: null,
      };
    },
    methods: {
      selectStudyArea(id) {
        this.currentStudyAreaId = id;
      },
      addArea(name, parentId) {
        action('addArea')(name, parentId);
      },
    },
    template: `
      <div style="width: 300px">
        <study-area-sidebar
          :studyAreas="studyAreas"
          :projectId="projectId"
          :currentStudyAreaId="currentStudyAreaId"
          :isEditMode="true"
          @selectArea="selectStudyArea"
          @addArea="addArea"
        />
      </div>
    `,
  }));
