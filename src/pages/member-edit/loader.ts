import { LoaderFunction, useParams } from "react-router-dom";
import { useAppNavigation } from "@/app";

export const MemberEditRouteLoader: LoaderFunction = async () => {
    const { id } = useParams();
    console.log(useParams())
    if (!id) return useAppNavigation().Members.toList();
};
