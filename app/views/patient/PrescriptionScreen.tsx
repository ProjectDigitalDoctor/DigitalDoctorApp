import React, {Component} from 'react';
import {Button, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {Table, Rows, TableWrapper, Cell} from 'react-native-table-component';
import 'intl';
import 'intl/locale-data/jsonp/de-DE';
import PrescriptionModel from '../../api/models/prescription';
import PrescriptionRepository from '../../api/prescriptionRepository';
import apiClient from '../../api/anonymousClient';

interface PrescriptionScreenState {
  prescription: PrescriptionModel;
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
    this.props.navigation.setOptions({title: this.state.prescription.drug.name});
  }

  _goBack = () => this.props.navigation.goBack();

  _orderOffer = (offerID: number) => {
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
      offerTable.push([offer.shop.name, `${offer.price}€`, offer.id]);
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
            <Button title="Vor Ort einlösen" onPress={() => {}} color="#3083DC" />
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
});
