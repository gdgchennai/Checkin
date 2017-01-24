import {
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  Button: {
    backgroundColor: '#9146A7',
    height: 40,
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  textInputContainer: {
    borderBottomColor: '#9146A7',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  textInput: {
    fontSize: 18,
    height: 40,
  },
  textInputLabel: {
    fontWeight: '200',
    paddingBottom: 10,
  },
});

export default styles;