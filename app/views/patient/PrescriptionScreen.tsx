import React, {Component} from 'react';
import {Alert, Button, Modal, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {Table, Rows, TableWrapper, Cell} from 'react-native-table-component';
import 'intl';
import 'intl/locale-data/jsonp/de-DE';
import PrescriptionModel from '../../api/models/prescription';
import PrescriptionRepository from '../../api/prescriptionRepository';
import apiClient from '../../api/authenticatedClient';
import QRCode from 'react-native-qrcode-generator';
import OfferModel from '../../api/models/offer';
import Icon from 'react-native-vector-icons/Ionicons';

interface PrescriptionScreenState {
  prescription: PrescriptionModel;
  qrCodeValue?: string;
}

interface PrescriptionScreenProps {
  navigation: any;
  route: any;
}

class PrescriptionScreen extends Component<PrescriptionScreenProps, PrescriptionScreenState> {
  repo: PrescriptionRepository = new PrescriptionRepository(apiClient);

  constructor(props: PrescriptionScreenProps) {
    super(props);
    this.state = {
      prescription: props.route.params.prescription,
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: this.state.prescription.drug.name,
      headerLeft: () => (
        <Icon.Button
          name="arrow-back"
          size={25}
          backgroundColor="#32a852"
          onPress={() => {
            this.props.navigation.goBack();
          }}
        />
      ),
    });
  }

  componentDidUpdate(prevProps: PrescriptionScreenProps, prevState: PrescriptionScreenState) {
    if (prevState.prescription.redeemed !== this.state.prescription.redeemed) {
      this.props.navigation.setOptions({
        headerLeft: () => (
          <Icon.Button
            name="arrow-back"
            size={25}
            backgroundColor="#32a852"
            onPress={() => {
              this.props.navigation.navigate('Prescriptions', {refresh: true});
            }}
          />
        ),
      });
    }
  }

  _orderOffer = (offer: OfferModel) => {
    Alert.alert(
      'Bestellung Bestätigen',
      `Wollen Sie die Bestellung für "${this.state.prescription.drug.name}" bei "${offer.shop.name}" für ${offer.price}€ aufgeben?`,
      [
        {
          text: 'Abbrechen',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'Bestellen', onPress: () => this._orderOfferImpl(offer.id)},
      ],
      {cancelable: false},
    );
  };

  _orderOfferImpl = (offerID: number) => {
    this.repo
      .orderOffer(this.state.prescription.id, offerID)
      .then(() => {
        let newPrescription = {...this.state.prescription};
        newPrescription.redeemed = true;
        this.setState({prescription: newPrescription});
        ToastAndroid.show('Medikament erfolgreich bestellt!', ToastAndroid.LONG);
      })
      .catch((error) => {
        console.error('Failed to order offer: ' + error);
        ToastAndroid.show('Fehler beim Bestellen des Medikaments!', ToastAndroid.LONG);
      });
  };

  _localRedeem = () => {
    this.setState({
      qrCodeValue: `${this.repo.client.defaults.baseURL}prescription/${this.state.prescription.id}/redeem`,
    });
  };

  render = () => {
    const dateFormat = new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const attributeTable = [
      ['Ausgestellt am:', `${dateFormat.format(new Date(this.state.prescription.dateOfIssue))}`],
      ['Gültig bis:', `${dateFormat.format(new Date(this.state.prescription.validUntil))}`],
      ['Ausgestellt von:', `${this.state.prescription.doctor.firstName} ${this.state.prescription.doctor.lastName}`],
      ['PZN:', `${this.state.prescription.drug.pzn}`],
      ['Hersteller:', `${this.state.prescription.drug.manufacturer.name}`],
      ['Nebenwirkungen:', `${this.state.prescription.drug.sideEffects}`],
      ['Art der Einnahme:', `${this.state.prescription.drug.usage}`],
      ['Einnahmehäufigkeit:', `${this.state.prescription.usageDescription}`],
    ];

    const offerTable = [];
    for (const offer of this.state.prescription.drug.offers) {
      offerTable.push([offer.shop.name, `${offer.price}€`, offer]);
    }

    const orderOfferElement = (data: any) => (
      <TouchableOpacity onPress={() => this._orderOffer(data)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Bestellen</Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.content}>
        <Modal visible={this.state.qrCodeValue !== undefined} transparent={false} animationType={'slide'}>
          <View style={styles.modal}>
            <QRCode value={this.state.qrCodeValue!} size={200} bgColor="#000000" fgColor="lightgrey" />
            <Button onPress={() => this.setState({qrCodeValue: undefined})} title="Schließen" color="#3083DC" />
          </View>
        </Modal>
        <Table style={styles.attributeTable}>
          <Rows data={attributeTable} textStyle={styles.rowText} style={styles.row} />
        </Table>
        {this.state.prescription.redeemed && <Text style={styles.info}>Rezept bereits eingelöst!</Text>}
        {!this.state.prescription.redeemed && (
          <>
            <Text style={styles.info}>Rezept jetzt einlösen</Text>
            <Table style={styles.offerTable}>
              {offerTable.map((rowData, index) => (
                <TableWrapper key={index} style={styles.offerRow}>
                  {rowData.map((cellData, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      data={cellIndex === 2 ? orderOfferElement(cellData) : cellData}
                      textStyle={styles.rowText}
                      style={cellIndex === 0 ? styles.offerShopNameCell : styles.offerCell}
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table>
            <Button title="Vor Ort einlösen" onPress={this._localRedeem} color="#3083DC" />
          </>
        )}
      </View>
    );
  };
}

export default PrescriptionScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#32a852',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
    paddingTop: 25,
    justifyContent: 'flex-start',
  },
  row: {
    marginBottom: 5,
  },
  rowText: {
    fontSize: 18,
  },
  attributeTable: {
    marginBottom: 25,
  },
  btn: {
    backgroundColor: '#3083DC',
    borderRadius: 2,
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
  },
  offerRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  offerCell: {
    width: '20%',
  },
  offerShopNameCell: {
    width: '60%',
  },
  offerTable: {
    marginBottom: 25,
  },
  info: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modal: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 150,
    backgroundColor: 'lightgrey',
  },
});
