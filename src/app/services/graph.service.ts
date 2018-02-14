import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HellojsauthService } from './hellojsauth.service'
import { Client } from "@microsoft/microsoft-graph-client";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";

@Injectable()
export class GraphService {

    constructor(private authService: HellojsauthService, private http: HttpClient) { }


    /**
     * wont work if no admin consent
     */
    public async getGroupAsync(groupId: string): Promise<MicrosoftGraph.Group> {

        try {

            var client = Client.init({

                authProvider: async (done) => {

                    let access_token = await this.authService.tryGetAccessTokenAsync();

                    if (!access_token)
                        done('cant get token', undefined)
                    else
                        done(null, access_token); //first parameter takes an error if you can't get an access token
                }
            });

            let group: MicrosoftGraph.Group = await client.api(`/groups/${groupId}`).version("beta").get();

            return group;

        } catch (error) {
            console.log(error);
        }
    }

    public async getGroupMembersAsync(groupId: string): Promise<[MicrosoftGraph.DirectoryObject] | undefined> {

        try {

            var client = Client.init({

                authProvider: async (done) => {

                    let access_token = await this.authService.tryGetAccessTokenAsync();
                    alert(access_token);
                    if (!access_token)
                        done('cant get token', undefined)
                    else
                        done(null, access_token); //first parameter takes an error if you can't get an access token
                }
            });


            let members: [MicrosoftGraph.DirectoryObject] = await client.api(`/groups/${groupId}/members`).version("beta").get();

            alert(members);
            return members;

        } catch (error) {
            console.log(error);
            return undefined;

        }
    }
}
