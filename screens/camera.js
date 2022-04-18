import * as React from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class PickImage extends React.Component {
  constructor(){
    this.state = {
      image: null,
      finalOutput : []
    };
  
  }
  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  uploadImage = async (uri) => {
    const data = new FormData();
    let filename = uri.split("/")[uri.split("/").length - 1]
    let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
    const fileToUpload = {
      uri: uri,
      name: filename,
      type: type,
    };
    const url = "https://3cfe-36-255-86-117.ngrok.io/predit-digit"

    // in class 125 we used post method to predict digit same method we are adding by using axios functions
    await axios({
        method: "POST",
        url: url,
        data: Data,
        config: {
            headers: {
                "Content-type": "multipart/form-data",
            }
        }
    })
    .then((response) => response)

    // after getting response feching result 
    .then((result) => {
        console.log("Sucess:", result.data)
        this.setState({
            finalOutput: result.data
        })
        //console.log(this.state.finalOutput)
    })
    .catch((error) => {
        console.error("Error :", error)

    })
  };

    _pickImage = async () => {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [8, 10],
          quality: 1,
        });
        if (!result.cancelled) {
          this.setState({ image: result.uri });
          console.log(result.uri)
          this.uploadImage(result.uri);
        }
      } catch (E) {
        console.log(E);
      }
    };
}