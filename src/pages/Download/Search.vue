<template>
  <div class="container">
    <h1 class="text-green">資料篩選與下載</h1>
    <!-- Tabs -->
    <div class="tab">
      <!-- Nav Tabs -->
      <ul class="nav-tab">
        <li class="tab-item active">
          <a role="button">資料篩選</a>
        </li>
        <li class="tab-item">
          <a role="button">資料計算</a>
        </li>
      </ul>
      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Content: Data Filter -->
        <div id="search" class="tab-pane active">
          <form action="" class="form" @submit.stop.prevent="submitSearch()">
            <h5>資料來源</h5>
            <div class="gray-block">
              <div class="form-content">
                <div class="row">
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">計畫名稱：</label>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">樣區：</label>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">子樣區：</label>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="form-group">
                      <label class="required">相機位置：</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-action">
                <a>
                  <span class="icon-remove"></span>
                </a>
              </div>
            </div>
            <div class="row">
              <div class="col-12 text-right">
                <a class="text-green btn pr-0">
                  <span class="icon"><i class="icon-add-green"></i></span>
                  <span class="text">新增資料來源</span>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
