import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Participant, ParticipantProps } from "@/components/Participant";
import { TripLink, TripLinkProps } from "@/components/TripLink";
import { linksServer } from "@/server/links-server";
import { participantsServer } from "@/server/participants-server";
import { colors } from "@/styles/colors";
import { validateInput } from "@/utils/validateInput";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { detailsStyles } from "./trip.styles";

const {
  container,
  title,
  linksContainer,
  linksEmpty,
  invitedContainer,
  invitedTitle,
  modalContainer,
} = detailsStyles();

type Props = {
  tripId: string;
};

export function Details({ tripId }: Props) {
  // MODAL
  const [showNewLinkModal, setShowNewLinkModal] = useState(false);

  // LOADING
  const [isCreatingLinkTrip, setIsCreatingLinkTrip] = useState(false);

  // DATA
  const [linkTitle, setLinkTitle] = useState("");
  const [linkURL, setLinkURL] = useState("");

  // LIST
  const [links, setLinks] = useState<TripLinkProps[]>([]);
  const [participants, setParticipants] = useState<ParticipantProps[]>([]);

  function resetNewLinkFields() {
    setLinkTitle("");
    setLinkURL("");
    setShowNewLinkModal(false);
  }

  async function handleCreateTripLink() {
    try {
      if (!linkTitle.trim()) {
        return Alert.alert("Link", "Informe um título para o link.");
      }

      if (!validateInput.url(linkURL.trim())) {
        return Alert.alert("Link", "Link inválido!");
      }

      setIsCreatingLinkTrip(true);

      await linksServer.create({
        tripId,
        title: linkTitle,
        url: linkURL,
      });

      Alert.alert("Link", "Link criado com sucesso!");

      resetNewLinkFields();
      await getTripLinks();
    } catch (error) {
      console.log(error);
      Alert.alert("Link", "Erro ao criar link.");
    } finally {
      setIsCreatingLinkTrip(false);
    }
  }

  async function getTripLinks() {
    try {
      const links = await linksServer.getLinksByTripId(tripId);
      setLinks(links);
    } catch (error) {
      console.log(error);
      Alert.alert("Link", "Erro ao obter links.");
    }
  }

  async function getTripParticipants() {
    try {
      const participants = await participantsServer.getByTripId(tripId);
      setParticipants(participants);
    } catch (error) {
      console.log(error);
      Alert.alert("Participants", "Erro ao obter os participantes.");
    }
  }

  useEffect(() => {
    getTripLinks();
    getTripParticipants();
  }, []);

  return (
    <View className={container()}>
      <Text className={title()}>Links importantes</Text>

      <View className={linksContainer()}>
        <FlatList
          data={links}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TripLink data={item} />}
          contentContainerClassName="gap-4"
          ListEmptyComponent={() => (
            <Text className={linksEmpty()}>Nenhum link adicionado.</Text>
          )}
        />

        <Button variant="secondary" onPress={() => setShowNewLinkModal(true)}>
          <Plus color={colors.zinc[200]} size={20} />
          <Button.ButtonText>Cadastrar novo link</Button.ButtonText>
        </Button>
      </View>

      <View className={invitedContainer()}>
        <Text className={invitedTitle()}>Convidados</Text>

        <FlatList
          data={participants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Participant data={item} />}
          contentContainerClassName="gap-4 pb-44"
        />
      </View>

      <Modal
        title="Cadastrar link"
        subtitle="Todos os convidados podem visualizar os links importantes."
        visible={showNewLinkModal}
        onClose={() => setShowNewLinkModal(false)}
      >
        <View className={modalContainer()}>
          <Input variant="secondary">
            <Input.Field
              placeholder="Título do link"
              onChangeText={setLinkTitle}
            />
          </Input>

          <Input variant="secondary">
            <Input.Field placeholder="URL" onChangeText={setLinkURL} />
          </Input>
        </View>

        <Button isLoading={isCreatingLinkTrip} onPress={handleCreateTripLink}>
          <Button.ButtonText>Salvar link</Button.ButtonText>
        </Button>
      </Modal>
    </View>
  );
}
