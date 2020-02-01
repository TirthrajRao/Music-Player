import { Component, ViewChild } from '@angular/core';
import { NavController, Range } from 'ionic-angular';
import { Howl } from 'howler';
// import { FilePath,FilePathOriginal } from '@ionic-native/file-path';
import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  playList = [
    {
      name: 'Dil hai Tumhara',
      path: '../../assets/music/1.mp3'
    },
    {
      name: 'Dil khairia',
      path: '../../assets/music/2.mp3'
    },
    {
      name: 'Makhana',
      path: '../../assets/music/3.mp3'
    },
  ];
  activeTrack = null;
  player: Howl = null;
  isPlaying = false;
  progress = 0;
  _fileList=[]
  @ViewChild('range') range: Range;
  constructor(public navCtrl: NavController,  public file: File) {
    console.log(this.playList);
    //the first parameter file.externalRootDirectory is for listing all files on application's root directory
    //The second parameter is the name of the folder. You can specify the nested folder here. e.g. 'Music/Coldplay'
   console.log("--------",this.file)
    this.file.listDir(this.file.externalRootDirectory, '').then((result) => {
      console.log("results===>",result)
      for (let item of result) {
        if (item.isDirectory == true && item.name != '.' && item.name != '..') {
          this.getFileList(item.name);//Get all the files inside the folder. recursion will probably be useful here.
        }
        else if (item.isFile == true) {
          //File found
          this._fileList.push({
            name: item.name,
            path: item.fullPath
          });
        }
        console.log("filelist",this._fileList)
      }
    },
      (error) => {
        console.log(error);
      });
  }

  getFileList(path: string): any {
    let file = new File();
    file.listDir(file.externalRootDirectory, path)
      .then((result) => {
        console.log("resultsss",result)
        for (let item of result) {
          if (item.isDirectory == true && item.name != '.' && item.name != '..') {
            this.getFileList(path + '/' + item.name);
          }
          else {
            this._fileList.push({
              name: item.name,
              path: item.fullPath
            })
          }
          console.log("filelisttttt",this._fileList)
        }
      }, (error) => {
        console.log(error);
      })

  }


  start(track) {
    console.log(track);
    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.path],
      onplay: () => {
        console.log("onplay")
        this.isPlaying = true;
        this.activeTrack = track;
        this.updateProgress();
      },
      onend: () => {
        console.log("onend");
        this.next()
      }
    })
    this.player.play()
  }

  togglePlayer(pause) {
    this.isPlaying = !pause;
    if (pause) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  next() {
    let index = this.playList.indexOf(this.activeTrack);
    if (index != this.playList.length - 1) {
      this.start(this.playList[index + 1])
    } else {
      this.start(this.playList[0])
    }
  }

  prev() {
    let index = this.playList.indexOf(this.activeTrack);
    if (index > 0) {
      this.start(this.playList[index - 1])
    } else {
      this.start(this.playList[this.playList.length - 1])
    }
  }


  seek() {
    let newValue = +this.range.value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue / 100));
  }

  updateProgress() {
    let seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress()
    }, 1000);
  }
}
