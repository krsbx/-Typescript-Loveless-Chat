import { auth, database, storage } from '../Component/FirebaseSDK';
import { CreateBlob } from '../Utility/Utility';
import { UserInformations } from '../Component/DataInterface';

export const RegisterUser = async (
  Nickname: string,
  Email: string,
  Password: string,
  emptyProfile: string,
  Profile: string
) => {
  try {
    let ProfileUrl: string = emptyProfile;

    const currentUser = await auth.createUserWithEmailAndPassword(
      Email,
      Password
    );

    const Key = `UID.${Nickname}`;

    const UID: string = currentUser.user?.uid as string;

    let toUpdate: any = {};
    toUpdate[Key] = UID;

    //Add User To Database Entry
    await database.collection('Database').doc('Users').update(toUpdate);

    if (Profile) {
      const extensions = Profile.substr(Profile.lastIndexOf('.' + 1));

      const PicturesRef = storage.ref(`Profile`).child(`${UID}.${extensions}`);

      await PicturesRef.put(await CreateBlob(Profile));
      const PicturesUrl = await PicturesRef.getDownloadURL();
      ProfileUrl = PicturesUrl;
    }

    const UserInformations: UserInformations = {
      Nickname: Nickname,
      UID: UID,
      Profile: ProfileUrl,
      FullName: '',
      Token: '',
    };

    //Add User Informations in Databases
    await database
      .collection('Database')
      .doc('Users')
      .collection(UID)
      .doc('Informations')
      .set(UserInformations);

    await currentUser.user?.updateProfile({
      displayName: Nickname,
      photoURL: ProfileUrl,
    });
  } catch (error) {
    console.error(error);
  }
};
