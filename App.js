import React, { useState } from 'react';
import { Provider as PaperProvider, Appbar, TextInput, Button, List, Title, Modal, Portal, IconButton } from 'react-native-paper';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

export default function App() {
  const [item, setItem] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [valor, setValor] = useState('');
  const [lista, setLista] = useState([]);
  const [editarIndex, setEditarIndex] = useState(null);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showModal = (text) => {
    setMessage(text);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  // Formatação do valor para formato monetário
  const handleValorChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    const formattedValue = (numericValue / 100).toFixed(2).replace('.', ',');
    setValor(formattedValue);
  };

  // Função para adicionar ou atualizar um item na lista
  const salvarItem = () => {
    const novoItem = {
      item,
      quantidade: parseInt(quantidade) || 1,
      valor: parseFloat(valor.replace(',', '.')),
    };

    if (editarIndex !== null) {
      const novaLista = [...lista];
      novaLista[editarIndex] = novoItem;
      setLista(novaLista);
      setEditarIndex(null);
    } else {
      setLista([...lista, novoItem]);
    }

    setItem('');
    setQuantidade('1');
    setValor('');
  };

  // Função para editar um item
  const editarItem = (index) => {
    const itemParaEditar = lista[index];
    setItem(itemParaEditar.item);
    setQuantidade(itemParaEditar.quantidade.toString());
    setValor(itemParaEditar.valor.toFixed(2).replace('.', ','));
    setEditarIndex(index);
  };

  // Função para excluir um item
  const excluirItem = (index) => {
    const novaLista = lista.filter((_, i) => i !== index);
    setLista(novaLista);
  };

  // Calcular o valor total da lista
  const calcularTotal = () => {
    return lista.reduce((total, item) => total + item.quantidade * item.valor, 0).toFixed(2).replace('.', ',');
  };

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Lista de Compras" />
      </Appbar.Header>

      <View style={styles.container}>
        
        {/* Objetivos do App */}
        <Title style={styles.header}>Objetivos do App</Title>
        <Button mode="contained" onPress={() => showModal("Organize tudo o que precisa de maneira inteligente e nunca mais se perca nas prateleiras. Menos tempo de compras, mais tempo para você!")} style={styles.economyButton}>
          Economia de Tempo
        </Button>
        <Button mode="contained" onPress={() => showModal("Com o app, você vai ao mercado sabendo exatamente o que comprar, evitando gastos desnecessários. Economize dinheiro com listas mais inteligentes!")} style={styles.economyButton}>
          Economia de Dinheiro
        </Button>

        {/* Modal */}
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalText}>{message}</Text>
            <Button onPress={hideModal}>Fechar</Button>
          </Modal>
        </Portal>

        {/* Monte sua lista prática */}
        <Title style={styles.header}>Monte sua lista prática</Title>
        <TextInput
          label="Item"
          value={item}
          onChangeText={setItem}
          style={styles.input}
        />
        <TextInput
          label="Quantidade"
          value={quantidade}
          onChangeText={(text) => setQuantidade(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Valor"
          value={valor}
          onChangeText={handleValorChange}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button mode="contained" onPress={salvarItem}>
          {editarIndex !== null ? 'Salvar Alterações' : 'Adicionar Item'}
        </Button>

        <Title style={styles.title}>Sua Lista</Title>
        <ScrollView style={styles.scrollContainer}>
          {lista.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <List.Item
                title={`${item.item} - Quantidade: ${item.quantidade}`}
                description={`Valor total: R$ ${(item.quantidade * item.valor).toFixed(2).replace('.', ',')}`}
              />
              <View style={styles.actionButtons}>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => editarItem(index)}
                />
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => excluirItem(index)}
                />
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Total da Lista */}
        <Title style={styles.total}>Total da Lista: R$ {calcularTotal()}</Title>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  input: {
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    textAlign: 'center',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  economyButton: {
    marginVertical: 5,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});
