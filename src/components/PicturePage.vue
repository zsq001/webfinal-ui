<template>
  <div>
    <h2>Your Pictures</h2>
    <!--    <div v-for="picture in pictures" :key="picture.UUID">-->
    <!--      <img :src="'http://localhost:8080/img/' + picture.UUID" :alt="picture.name">-->
    <!--      <button @click="downloadPicture(picture.id)">Download</button>-->
    <!--      <button @click="deletePicture(picture.id)">Delete</button>-->
    <!--    </div>-->

    <mdui-list>
      <mdui-list-item>
          <input class="mdui-button" type="file" @change="onFileChange">
          <mdui-button @click="uploadPicture" variant="elevated" slot="end-icon">Upload</mdui-button>
      </mdui-list-item>
      <mdui-list-item v-for="picture in pictures" :key="picture.UUID">
        <div class="mdui-list-item-content">{{ picture.Name }}</div>
        <mdui-button variant="elevated" slot="end-icon" @click="previewPictures(picture.UUID)">Preview
        </mdui-button>
        <mdui-button variant="elevated" slot="end-icon" @click="downloadPicture(picture.UUID)">Download
        </mdui-button>
        <mdui-button variant="elevated" slot="end-icon" @click="deletePicture(picture.UUID)" >Delete
        </mdui-button>
      </mdui-list-item>
    </mdui-list>
    <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {

  data() {
    return {
      pictures: [],
      errorMessage: '',
      selectedFile: null
    }
  },
  methods: {
    async previewPictures(uuid) {
      window.open('http://localhost:8080/img/' + uuid, '_blank');
    },
    async fetchPictures() {
      try {
        const response = await fetch('http://localhost:8080/api/v1/pic/list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
            // Include any other headers your API requires, for example:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.status === 403) {
          alert("You don't have permission to get pictures!");
        }

        const data = await response.json();

        if (data && data.data) {
          this.pictures = data.data;
        } else {
          this.errorMessage = data.error;
        }
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    onFileChange(e) {
      this.selectedFile = e.target.files[0];

      // Check if the file size is greater than 1MB
      if (this.selectedFile.size > 1024 * 1024) {
        this.errorMessage = 'File size should be less than 1MB';
        this.selectedFile = null;
      }
    },
    async uploadPicture() {
      try {
        const formData = new FormData();
        formData.append('document', this.selectedFile);

        const response = await fetch('http://localhost:8080/api/v1/pic/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });

        if (!response.status === 403) {
          alert("You don't have permission to upload pictures!");
        }

        const data = await response.json();

        if (data && data.data) {
          this.pictures.push(data.data);
        } else {
          this.errorMessage = data.error;
        }
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async downloadPicture(uuid) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/pic/download/${uuid}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'picture.jpg'); // Use the actual file name here
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async deletePicture(uuid) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/pic/delete/${uuid}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 200) {
          await this.fetchPictures();
          console.log()
        } else {
          this.errorMessage = data.error;
        }
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  },
  created() {
    this.fetchPictures();
  },
}
</script>

<style scoped>
.error {
  color: red;
}
</style>