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
              {
                id: 'a1',
                title: '子樣區',
                failures: 0,
                isLockedAllCameraLocation: false,
              },
              {
                id: 'a2',
                title: '樣區 with error',
                failures: 1,
                isLockedAllCameraLocation: false,
              },
              {
                id: 'a3',
                title: '樣區 lock',
                failures: 0,
                isLockedAllCameraLocation: true,
              },
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
            title: '台北',
            children: [{ id: 'a1', title: '信義區' }],
          },
          {
            id: 'b',
            title: '台中',
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
      editArea(name, id) {
        action('editArea')(name, id);
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
          @editArea="editArea"
        />
      </div>
    `,
  }));
